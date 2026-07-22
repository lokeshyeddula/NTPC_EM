import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

msg = EmailMessage()
msg["Subject"] = "SMTP Test"
msg["From"] = os.getenv("EMAIL_HOST_USER")
msg["To"] = os.getenv("EMAIL_HOST_USER")
msg.set_content("SMTP test successful.")

with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()

    smtp.login(
        os.getenv("EMAIL_HOST_USER"),
        os.getenv("EMAIL_HOST_PASSWORD"),
    )

    smtp.send_message(msg)

print("✅ Email sent successfully!")