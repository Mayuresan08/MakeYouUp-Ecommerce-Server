const nodemailer = require("nodemailer")


const sendMail=async(email,subject,text)=>{

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
    }
});

var mailOptions={
    from:'guvitestmail@gmail.com',
    to:email,
    subject:subject,
    text:text
};

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log("Error in sending mail",error)
    }
    else{
        console.log('Email sent: ' + info.response);  
    }
})

}

module.exports=sendMail