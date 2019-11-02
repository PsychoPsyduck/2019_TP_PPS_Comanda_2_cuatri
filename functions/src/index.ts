import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
admin.initializeApp();


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

    auth: {
        user: 'duenolacomanda@gmail.com',
        pass: 'practica20192cuatri'
    }
  });

  exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        const idUsr = req.query.id;
  
        const mailOptions = {
            from: 'La comanda <duenolacomanda@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'Verificacion de correo', // email subject
            html:" <p style='font-size: 16px;'>Te damos la bienvenida a la comanda. <br>Por favor haz click en el siguiente enlace para terminar el proceso de registro de usuario:<br><a href='https://us-central1-practicaprofesional-dbd4e.cloudfunctions.net/validarMail?id="+idUsr+"'>Validar Mail</a></p>"
  
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro:any, info:any) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
  });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
