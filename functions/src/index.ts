
import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
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
            html: " <p style='font-size: 16px;'>Te damos la bienvenida a la comanda. <br>Por favor haz click en el siguiente enlace para terminar el proceso de registro de usuario:<br><a href='https://us-central1-lacomanda-91df5.cloudfunctions.net/validarMail?id=" + idUsr + "'>Click aquí para validar Mail</a></p>"

        };

        // returning result
        return transporter.sendMail(mailOptions, (erro: any, info: any) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.mailRechazo = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const dest = req.query.dest;
        //const idUsr = req.query.id;

        const mailOptions = {
            from: 'La comanda <duenolacomanda@gmail.com>', 
            to: dest,
            subject: 'Registro rechazado', 
            html: " <p style='font-size: 16px;'>Te informamos que tu solicitud de registro fue rechazada.</p>"

        };

        // returning result
        return transporter.sendMail(mailOptions, (erro: any, info: any) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.validarMail = functions.https.onRequest((req, res) => {

    const db = admin.firestore()
    db.collection("usuarios").doc(req.query.id).update("estado", "activo").then((data: any) => {
        return res.send('Registro completo!');
    }).catch((data: any) => {
        return res.send(' Error!');
    });

})

exports.enviarNotificacion = functions.https.onRequest((req, res) => {

    // const db = admin.firestore()
    // db.collection("usuarios").get().then((snapshot: any): any => {
        // let tokens: any[] = [];
        
        // snapshot.forEach((doc: any) => {
        //     let usuario = doc.data();
        //     if (usuario.tipo == req.query.tipo && usuario.token != null) {
        //         tokens.push(usuario.token);
        //     }
        // });

        // if (tokens.length != 0) {
            let mensaje = {
                notification: {
                    title: req.query.titulo,
                    body: req.query.mensaje,
                  },
                //tokens: tokens
                topic: req.query.tipo
            };

            admin.messaging().send(mensaje)
                .then((response: any) => {
                    return res.send('Notificación enviada correctamente: ' + response);
                })
                .catch((error: any) => {
                    return res.send('Error al enviar notificación: ' + error);
                });
        // } else {
        //     return res.send('No se envió ninguna notificación');
        // }
    // })
})


exports.createUser = functions.firestore
    .document('usuarios/{id}')
    .onCreate(async (snap, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      //const newValue = snap.data();

      // access a particular field as you would any JS property
      
        //const name = newValue!.name;
        const payload = {
            notification: {
                title: 'Prueba',
                //body: `${data} is following your content!`,
                body: `Damian is watching you!`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
          
          }
      
          let tokens: any[]=[];
      
          const db = admin.firestore()
          db.collection("usuarios").get().then((snapshot: any): any => {
              
             
              snapshot.forEach((doc: any) => {
                  let usuario = doc.data();
                  if (usuario.token != null) {
                      tokens.push(usuario.token);
                  }
              });
      
          // send a notification to each device token

    
    

        
        return admin.messaging().sendToDevice(tokens, payload)
      // perform desired operations ...
    });
    })

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
