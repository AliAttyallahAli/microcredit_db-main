<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Client.php';
include_once '../models/User.php';

// Set headers for PDF file
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="reçu_identification_client.pdf"');

$database = new Database();
$db = $database->getConnection();

// Get client ID from query parameter
$client_id = isset($_GET['client_id']) ? intval($_GET['client_id']) : null;

if (!$client_id) {
    http_response_code(400);
    echo "ID client requis";
    exit;
}

try {
    // Get client data
    $client = new Client($db);
    $client->id = $client_id;
    
    if (!$client->readOne()) {
        http_response_code(404);
        echo "Client non trouvé";
        exit;
    }

    // Get user who created the client
    $user = new User($db);
    $user->id = $client->created_by;
    $user->readOne();

    // Include TCPDF library
    require_once('../libs/tcpdf/tcpdf.php');

    // Create new PDF document
    $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

    // Set document information
    $pdf->SetCreator('CMC-ATDR');
    $pdf->SetAuthor('CMC-ATDR');
    $pdf->SetTitle('Reçu d\'Identification Client - ' . $client->first_name . ' ' . $client->last_name);
    $pdf->SetSubject('Reçu d\'Identification Client');

    // Remove default header/footer
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);

    // Set margins
    $pdf->SetMargins(15, 15, 15);
    $pdf->SetAutoPageBreak(TRUE, 25);

    // Add a page
    $pdf->AddPage();

    // Set font
    $pdf->SetFont('helvetica', '', 10);

    // HTML content for the receipt
    $html = '
    <style>
        .header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #27ae60; 
            padding-bottom: 15px;
        }
        .logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #27ae60; 
            margin-bottom: 5px;
        }
        .title { 
            font-size: 18px; 
            font-weight: bold; 
            margin: 10px 0; 
            color: #2c3e50;
        }
        .subtitle { 
            font-size: 14px; 
            color: #7f8c8d; 
            margin-bottom: 5px;
        }
        .section { 
            margin: 15px 0; 
            padding: 15px; 
            border: 1px solid #ecf0f1; 
            border-radius: 5px;
            background-color: #f8f9fa;
        }
        .section-title { 
            font-size: 14px; 
            font-weight: bold; 
            color: #27ae60; 
            margin-bottom: 10px;
            border-bottom: 1px solid #27ae60;
            padding-bottom: 5px;
        }
        .info-grid { 
            display: table; 
            width: 100%; 
            margin: 10px 0;
        }
        .info-row { 
            display: table-row; 
        }
        .info-label { 
            display: table-cell; 
            font-weight: bold; 
            color: #7f8c8d; 
            padding: 5px 10px 5px 0;
            width: 30%;
        }
        .info-value { 
            display: table-cell; 
            padding: 5px 0; 
            color: #2c3e50;
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 15px; 
            border-top: 1px solid #ecf0f1; 
            text-align: center; 
            font-size: 10px; 
            color: #7f8c8d;
        }
        .signature-area { 
            margin-top: 40px; 
            display: table; 
            width: 100%;
        }
        .signature-box { 
            display: table-cell; 
            width: 45%; 
            text-align: center;
        }
        .signature-line { 
            border-top: 1px solid #7f8c8d; 
            width: 200px; 
            margin: 20px auto 5px auto;
        }
        .watermark {
            position: absolute;
            opacity: 0.1;
            font-size: 80px;
            color: #27ae60;
            transform: rotate(-45deg);
            z-index: -1;
        }
    </style>

    <div class="header">
        <div class="logo">CMC-ATDR</div>
        <div class="subtitle">Agence de Microcrédit</div>
        <div class="title">REÇU D\'IDENTIFICATION CLIENT</div>
        <div class="subtitle">Référence: RC' . str_pad($client->id, 6, '0', STR_PAD_LEFT) . '</div>
    </div>

    <div style="position: relative;">
        <div class="watermark" style="top: 200px; left: 50px;">CMC-ATDR</div>
        <div class="watermark" style="top: 400px; right: 50px;">OFFICIEL</div>
    </div>

    <div class="section">
        <div class="section-title">INFORMATIONS PERSONNELLES</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Nom complet:</div>
                <div class="info-value">' . htmlspecialchars($client->first_name . ' ' . $client->last_name) . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Numéro d\'identification:</div>
                <div class="info-value">' . htmlspecialchars($client->id_number) . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">' . htmlspecialchars($client->email) . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Téléphone:</div>
                <div class="info-value">' . htmlspecialchars($client->phone) . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date d\'enregistrement:</div>
                <div class="info-value">' . date('d/m/Y à H:i', strtotime($client->created_at)) . '</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">INFORMATIONS FINANCIÈRES</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Portefeuille numérique:</div>
                <div class="info-value" style="font-family: monospace; font-size: 9px;">' . htmlspecialchars($client->wallet_address) . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Solde initial:</div>
                <div class="info-value">0 XOF</div>
            </div>
            <div class="info-row">
                <div class="info-label">Statut du compte:</div>
                <div class="info-value"><span style="color: ' . ($client->status == 'active' ? '#27ae60' : '#e74c3c') . '; font-weight: bold;">' . strtoupper($client->status) . '</span></div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">ADRESSE</div>
        <div style="padding: 10px; background: white; border-radius: 3px; border: 1px solid #ecf0f1;">
            ' . nl2br(htmlspecialchars($client->address)) . '
        </div>
    </div>

    <div class="section">
        <div class="section-title">INFORMATIONS DE L\'AGENT</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Agent enregistreur:</div>
                <div class="info-value">' . htmlspecialchars($user->first_name . ' ' . $user->last_name) . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date d\'émission:</div>
                <div class="info-value">' . date('d/m/Y à H:i') . '</div>
            </div>
            <div class="info-row">
                <div class="info-label">Référence du reçu:</div>
                <div class="info-value">RC' . str_pad($client->id, 6, '0', STR_PAD_LEFT) . '-' . date('YmdHis') . '</div>
            </div>
        </div>
    </div>

    <div class="signature-area">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div style="font-size: 10px; color: #7f8c8d;">Signature du Client</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div style="font-size: 10px; color: #7f8c8d;">Signature de l\'Agent</div>
        </div>
    </div>

    <div class="footer">
        <div style="margin-bottom: 5px;">Ce document est généré électroniquement et ne nécessite pas de signature physique.</div>
        <div>CMC-ATDR © ' . date('Y') . ' | Tél: +225 XX XX XX XX | Email: contact@cmc-atdr.com</div>
        <div>Document sécurisé - Numéro de référence: ' . uniqid('CMC-') . '</div>
    </div>';

    // Print HTML content
    $pdf->writeHTML($html, true, false, true, false, '');

    // Close and output PDF document
    $pdf->Output('reçu_identification_' . $client->first_name . '_' . $client->last_name . '.pdf', 'D');

} catch (Exception $e) {
    http_response_code(500);
    echo "Erreur lors de la génération du document: " . $e->getMessage();
    exit;
}
?>