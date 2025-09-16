<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Client.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['client_id'])) {
        $client_id = $_GET['client_id'];
        
        $client = new Client($db);
        $client->id = $client_id;
        
        if ($client->readOne()) {
            require_once('../libs/tcpdf/tcpdf.php');
            
            // Créer nouveau document PDF pour la carte
            $pdf = new TCPDF('L', 'mm', array(86, 54), true, 'UTF-8', false); // Format carte de crédit
            
            // Information du document
            $pdf->SetCreator('CMC-ATDR');
            $pdf->SetAuthor('CMC-ATDR');
            $pdf->SetTitle('Carte d\'Identification Client - ' . $client->first_name . ' ' . $client->last_name);
            $pdf->SetSubject('Carte d\'Identification Client');
            
            // Supprimer les marges
            $pdf->SetMargins(5, 5, 5);
            $pdf->SetHeaderMargin(0);
            $pdf->SetFooterMargin(0);
            
            // Supprimer le header et footer
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            
            // Ajouter une page
            $pdf->AddPage();
            
            // Style CSS pour la carte
            $style = '
            <style>
                .card {
                    border: 2px solid #3498db;
                    border-radius: 10px;
                    padding: 5px;
                    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                    height: 44mm;
                    width: 76mm;
                }
                .header {
                    background: #3498db;
                    color: white;
                    padding: 3px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                    margin: -5px -5px 5px -5px;
                    font-size: 8px;
                }
                .photo {
                    width: 25mm;
                    height: 25mm;
                    border: 2px solid #3498db;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-right: 3px;
                }
                .info {
                    font-size: 6px;
                }
                .info strong {
                    color: #3498db;
                }
                .qr-code {
                    width: 15mm;
                    height: 15mm;
                    border: 1px solid #ddd;
                    padding: 1px;
                }
                .footer {
                    background: #2c3e50;
                    color: white;
                    padding: 2px;
                    text-align: center;
                    border-radius: 0 0 5px 5px;
                    margin: 5px -5px -5px -5px;
                    font-size: 6px;
                }
            </style>
            ';
            
            // Contenu de la carte
            $html = $style . '
            <div class="card">
                <div class="header">
                    <strong>CMC-ATDR - CARTE D\'IDENTIFICATION CLIENT</strong>
                </div>
                
                <table width="100%" border="0" cellpadding="1" cellspacing="1">
                    <tr>
                        <td width="35%" rowspan="4" valign="top" style="text-align: center;">
                            <div class="photo">
                                <img src="../' . ($client->photo ?: 'images/default-avatar.png') . '" width="25mm" height="25mm" />
                            </div>
                        </td>
                        <td width="65%" valign="top">
                            <div class="info">
                                <strong>Nom:</strong> ' . $client->last_name . '<br>
                                <strong>Prénom:</strong> ' . $client->first_name . '<br>
                                <strong>ID:</strong> CL' . str_pad($client->id, 6, '0', STR_PAD_LEFT) . '
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <div class="info">
                                <strong>Tél:</strong> ' . $client->phone . '<br>
                                <strong>CNI:</strong> ' . $client->id_number . '
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <div class="info">
                                <strong>Portefeuille:</strong><br>
                                <small>' . substr($client->wallet_address, 0, 15) . '...' . '</small>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td valign="bottom" style="text-align: center;">
                            <div class="qr-code">
                                <!-- Placeholder for QR code -->
                                <div style="text-align: center; font-size: 4px;">
                                    QR CODE<br>
                                    <span style="font-size: 3px;">' . $client->wallet_address . '</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                
                <div class="footer">
                    Émis le: ' . date('d/m/Y') . ' | CMC-ATDR © 2024
                </div>
            </div>
            ';
            
            // Écrire le HTML dans le PDF
            $pdf->writeHTML($html, true, false, true, false, '');
            
            // Output le PDF
            $pdf->Output('carte_identification_' . $client->first_name . '_' . $client->last_name . '.pdf', 'D');
            
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Client not found."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Client ID is required."));
    }
}
?>