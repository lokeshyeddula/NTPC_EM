import os
import smtplib
from email.message import EmailMessage
from typing import List, Optional

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
        attachment: Optional[bytes] = None,
        attachment_name: Optional[str] = None,
    ) -> bool:

        try:

            msg = EmailMessage()

            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = ", ".join(recipients)

            # Plain Text / HTML
            if is_html:
                msg.add_alternative(body, subtype="html")
            else:
                msg.set_content(body)

            # PDF Attachment
            if attachment is not None:

                msg.add_attachment(
                    attachment,
                    maintype="application",
                    subtype="pdf",
                    filename=attachment_name
                    if attachment_name
                    else "Inspection_Report.pdf",
                )

            # Send Mail
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
                print("=" * 60)
                print("Recipients:", recipients)
                print("To Header:", msg["To"])
                print("=" * 60)
                smtp.send_message(msg)

            print("Email Sent Successfully")

            return True

        except Exception as e:

            print(f"Email Error : {e}")

            return False


email_service = EmailService()