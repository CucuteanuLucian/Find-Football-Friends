from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, From
from django.conf import settings

def send_reset_password_email(to_email, reset_link):
    message = Mail(
        from_email=From('noreply@findfootballfriends.online', "Find Football Friends"),
        to_emails=To(to_email),
        subject='Password Reset - Find Football Friends',
        html_content=f"""
        <html>
          <body>
            <p>Hi,</p>
            <p>Press the button down below to reset your password:</p>
            <a href="{reset_link}" style="padding: 10px 15px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not asked for this, then ignore this email.</p>
          </body>
        </html>
        """
    )

    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        sg.send(message)
    except Exception as e:
        print(f"Eroare la trimiterea emailului: {e}")
