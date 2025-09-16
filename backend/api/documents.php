<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Client.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->client_id) && !empty($data->document_type)) {
        $client_id = $data->client_id;
        $document_type = $data->document_type;
        $format = $data->format ?? 'pdf';
        $options = $data->options ?? [];
        
        $client = new Client($db);
        $client->id = $client_id;
        
        if ($client->readOne()) {
            // Récupérer les informations de l'utilisateur
            $user = new User($db);
            $user->id = $client->created_by;
            $user->readOne();
            
            switch ($document_type) {
                case 'identification_receipt':
                    generateIdentificationReceipt($client, $user, $format, $options);
                    break;
                    
                case 'id_card':
                    generateIDCard($client, $user, $format, $options);
                    break;
                    
                case 'membership_certificate':
                    generateMembershipCertificate($client, $user, $format, $options);
                    break;
                    
                case 'financial_statement':
                    generateFinancialStatement($client, $user, $format, $options);
                    break;
                    
                default:
                    http_response_code(400);
                    echo json_encode(array("message" => "Type de document non supporté."));
                    break;
            }
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Client non trouvé."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Données incomplètes."));
    }
}

function generateIdentificationReceipt($client, $user, $format, $options) {
    if ($format === 'pdf') {
        require_once('../libs/tcpdf/tcpdf.php');
        
        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
        $pdf->SetMargins(15, 15, 15);
        $pdf->SetAutoPageBreak(TRUE, 25);
        $pdf->AddPage();
        
        // Contenu du reçu avec design amélioré
        $html = generateReceiptHTML($client, $user, $options);
        $pdf->writeHTML($html, true, false, true, false, '');
        
        $filename = 'reçu_identification_' . sanitizeFilename($client->first_name . '_' . $client->last_name) . '.pdf';
        $pdf->Output($filename, 'D');
        
    } elseif ($format === 'html') {
        header('Content-Type: text/html');
        header('Content-Disposition: attachment; filename="reçu_identification.html"');
        echo generateReceiptHTML($client, $user, $options);
    }
}

function generateIDCard($client, $user, $format, $options) {
    if ($format === 'pdf') {
        require_once('../libs/tcpdf/tcpdf.php');
        
        $pdf = new TCPDF('L', 'mm', array(86, 54), true, 'UTF-8', false);
        $pdf->SetMargins(5, 5, 5);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->AddPage();
        
        $html = generateIDCardHTML($client, $user, $options);
        $pdf->writeHTML($html, true, false, true, false, '');
        
        $filename = 'carte_identification_' . sanitizeFilename($client->first_name . '_' . $client->last_name) . '.pdf';
        $pdf->Output($filename, 'D');
    }
}

function generateMembershipCertificate($client, $user, $format, $options) {
    if ($format === 'pdf') {
        require_once('../libs/tcpdf/tcpdf.php');
        
        $pdf = new TCPDF('L', 'mm', 'A4', true, 'UTF-8', false);
        $pdf->SetMargins(20, 20, 20);
        $pdf->AddPage();
        
        $html = generateCertificateHTML($client, $user, $options);
        $pdf->writeHTML($html, true, false, true, false, '');
        
        $filename = 'certificat_membre_' . sanitizeFilename($client->first_name . '_' . $client->last_name) . '.pdf';
        $pdf->Output($filename, 'D');
    }
}

function generateFinancialStatement($client, $user, $format, $options) {
    // Implémentation similaire pour les relevés financiers
}

function generateReceiptHTML($client, $user, $options) {
    $logo = isset($options['include_logo']) ? '<img src="../images/logo.png" width="80" />' : '';
    $watermark = isset($options['watermark']) ? 'background: url("../images/watermark.png") center center no-repeat; opacity: 0.1;' : '';
    
    return '
    <div style="' . $watermark . '">
        <table width="100%" style="margin-bottom: 20px;">
            <tr>
                <td width="30%">' . $logo . '</td>
                <td width="40%" style="text-align: center;">
                    <h1 style="color: #2c3e50; margin: 0;">CMC-ATDR</h1>
                    <p style="color: #7f8c8d; margin: 5px 0;">Agence de Microcrédit</p>
                </td>
                <td width="30%" style="text-align: right;">
                    <div style="border: 2px solid #3498db; padding: 10px; display: inline-block;">
                        <strong>REÇU N°: RC' . str_pad($client->id, 6, '0', STR_PAD_LEFT) . '</strong>
                    </div>
                </td>
            </tr>
        </table>
        
        <h2 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            REÇU D\'IDENTIFICATION CLIENT
        </h2>
        
        <!-- Contenu détaillé du reçu -->
    </div>
    ';
}

function generateIDCardHTML($client, $user, $options) {
    // HTML pour la carte d'identification
    return '
    <div style="border: 2px solid #3498db; border-radius: 10px; padding: 5px; background: white;">
        <!-- Design de la carte -->
    </div>
    ';
}

function generateCertificateHTML($client, $user, $options) {
    // HTML pour le certificat de membre
    return '
    <div style="border: 5px double #3498db; padding: 30px; text-align: center;">
        <!-- Design du certificat -->
    </div>
    ';
}

function sanitizeFilename($filename) {
    return preg_replace('/[^a-zA-Z0-9_-]/', '_', $filename);
}
?>