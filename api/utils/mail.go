package utils

import (
	"bytes"
	"log"
	"net/smtp"
	"os"
)

// Mail represents a email request
type Mail struct {
	From    string
	To      []string
	Subject string
	Body    string
}

func SendMail(mail Mail) {
	// Connect to the remote SMTP server.
	c, err := smtp.Dial(os.Getenv("MAILSERVER_HOST"))
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	// Set the sender and recipient.
	c.Mail(mail.From)
	c.Rcpt(mail.To[0])
	// Send the email body.
	wc, err := c.Data()
	if err != nil {
		log.Fatal(err)
	}
	defer wc.Close()

	// Subject and body of the email
	buf := bytes.NewBufferString("Subject: " + mail.Subject)
	buf.WriteString("\r\n\r\n")
	buf.WriteString(mail.Body)

	if _, err = buf.WriteTo(wc); err != nil {
		log.Fatal(err)
	}

}
