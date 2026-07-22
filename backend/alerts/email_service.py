import os
import smtplib
from email.message import EmailMessage
from typing import List

from dotenv import load_dotenv

load_dotenv()


class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("EMAIL_HOST")
        self.smtp_port = int(os.getenv("EMAIL_PORT"))
        self.username = os.getenv("EMAIL_HOST_USER")
        self.password = os.getenv("EMAIL_HOST_PASSWORD")
        self.from_email = os.getenv("DEFAULT_FROM_EMAIL")

    def send_email(
        self,
        subject: str,
        body: str,
        recipients: List[str],
        is_html: bool = False,
    ) -> bool:
        try:
            msg = EmailMessage()

            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = ", ".join(recipients)

            if is_html:
                msg.add_alternative(body, subtype="html")
            else:
                msg.set_content(body)

            with smtplib.SMTP(
                self.smtp_host,
                self.smtp_port,
            ) as smtp:

                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()

                smtp.login(
                    self.username,
                    self.password,
                )

                smtp.send_message(msg)

            return True

        except Exception as e:
            print(f"Email Error: {e}")
            return False


email_service = EmailService()