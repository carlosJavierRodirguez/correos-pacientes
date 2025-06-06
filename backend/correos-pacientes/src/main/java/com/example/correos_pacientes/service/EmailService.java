package com.example.correos_pacientes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    // correo que se enviará a los pacientes para recordarles que deben tomar su
    // medicina cada 5 minutos
    // Envío de correo para recordatorio de medicina
    public void reminderEmail(String addresMail, String name, String medicine, String date, String time) {
        try {
            String subject = "Recordatorio de Medicación";

            String bodyMail = String.format(
                    """
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body {
                                        font-family: 'Arial', sans-serif;
                                        background-color: #f4f4f4;
                                        margin: 0;
                                        padding: 0;
                                        color: #333;
                                    }
                                    .container {
                                        max-width: 600px;
                                        margin: 30px auto;
                                        background-color: #ffffff;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                        overflow: hidden;
                                        padding: 20px;
                                    }
                                    .header {
                                        background-color: #007BFF;
                                        color: white;
                                        text-align: center;
                                        padding: 20px;
                                        border-radius: 10px 10px 0 0;
                                    }
                                    .header h1 {
                                        margin: 0;
                                        font-size: 22px;
                                    }
                                    .content {
                                        padding: 20px;
                                        text-align: left;
                                    }
                                    .content p {
                                        font-size: 16px;
                                        margin: 10px 0;
                                        line-height: 1.6;
                                    }
                                    .footer {
                                        text-align: center;
                                        font-size: 12px;
                                        color: #777;
                                        margin-top: 20px;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="header">
                                        <h1>Recordatorio de Medicación</h1>
                                    </div>
                                    <div class="content">
                                        <p>Hola, <strong>%s</strong>,</p>
                                        <p>Este es un recordatorio para que tomes tu medicamento:</p>
                                        <ul>
                                            <li><strong>Medicamento:</strong> %s</li>
                                            <li><strong>Fecha:</strong> %s</li>
                                            <li><strong>Hora programada:</strong> %s</li>
                                        </ul>
                                        <p>Por favor confirma que lo tomaste, o contacta a tu médico si tienes alguna duda.</p>
                                    </div>
                                    <div class="footer">
                                        <p>© 2025 Sistema de Recordatorios MedicApp. Todos los derechos reservados.</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                            """,
                    name, medicine, date, time);

            emailSender(addresMail, subject, bodyMail);
        } catch (Exception e) {
            System.out.println("Error al enviar el correo: " + e.getMessage());
        }
    }

    // Envío de correo para recordatorio de medicina
    public void avancedEmail(String addresMail, String name, String medicine, String date, String time) {
        try {
            String subject = "Recordatorio de Medicamento - ¡Es hora de tu dosis!";

            String bodyMail = String.format(
                    """
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <style>
                                        body {
                                            font-family: 'Arial', sans-serif;
                                            background-color: #f4f4f4;
                                            margin: 0;
                                            padding: 0;
                                            color: #333;
                                        }
                                        .container {
                                            max-width: 600px;
                                            margin: 30px auto;
                                            background-color: #ffffff;
                                            border-radius: 10px;
                                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                            overflow: hidden;
                                            padding: 20px;
                                        }
                                        .header {
                                            background-color: #007BFF;
                                            color: white;
                                            text-align: center;
                                            padding: 20px;
                                            border-radius: 10px 10px 0 0;
                                        }
                                        .header h1 {
                                            margin: 0;
                                            font-size: 22px;
                                        }
                                        .content {
                                            padding: 20px;
                                            text-align: left;
                                        }
                                        .content p {
                                            font-size: 16px;
                                            margin: 10px 0;
                                            line-height: 1.6;
                                        }
                                        .footer {
                                            text-align: center;
                                            font-size: 12px;
                                            color: #777;
                                            margin-top: 20px;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="header">
                                            <h1>Recordatorio de Medicamento</h1>
                                        </div>
                                        <div class="content">
                                            <p>Hola, <strong>%s</strong>,</p>
                                            <p>Este es un recordatorio para que tomes tu medicamento: <strong>%s</strong>.</p>
                                            <p>Fecha programada: <strong>%s</strong></p>
                                            <p>Hora programada: <strong>%s</strong></p>
                                            <p>Por favor, asegúrate de tomar tu dosis correspondiente a tiempo para mantener tu salud y bienestar.</p>
                                            <p>Si ya has tomado tu medicina, puedes ignorar este mensaje.</p>
                                            <p>¡Cuida tu salud y recuerda que estamos para apoyarte!</p>
                                        </div>
                                        <div class="footer">
                                            <p>© 2025 Sistema de Recordatorios MedicApp. Todos los derechos reservados.</p>
                                        </div>
                                    </div>
                                </body>
                                </html>
                            """,
                    name, medicine, date, time);

            emailSender(addresMail, subject, bodyMail);
        } catch (Exception e) {
            System.out.println("Error al enviar el correo: " + e.getMessage());
        }
    }

    public boolean emailSender(String addresMail, String subject, String bodyMail) throws MessagingException {
        try {
            // Creación del correo
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(addresMail);
            helper.setSubject(subject);
            helper.setText(bodyMail, true);
            javaMailSender.send(message);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return false;
    }
}
