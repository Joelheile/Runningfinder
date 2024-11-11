type Theme = {
  brandColor?: string;
  background?: string;
  text?: string;
  mainBackground?: string;
  buttonBackground?: string;
  buttonBorder?: string;
  buttonText?: string;
};

export async function sendVerificationRequest(params: { identifier: any; provider: any; url: any; theme: any; }) {
    const { identifier: to, provider, url, theme } = params
    const { host } = new URL(url)
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: provider.from,
        to,
        subject: "Bereit für deinen nächsten Run? 🏃",
        html: html({ url, host, theme }),
        text: text({ url, host }),
      }),
    })
   
    if (!res.ok)
      throw new Error("Resend error: " + JSON.stringify(await res.json()))
    }
  
  function text(params: { url: string; host: string }) {
      const { url, host } = params
      return "Bereit für deinen nächsten Run? 🏃"
    }
   
function html(params: { url: string; host: string; theme: Theme }) {
    const { url, host, theme } = params
  
    const escapedHost = host.replace(/\./g, "&#8203;.")
  
    const brandColor = theme.brandColor || "#346df1"
    const color = {
      background: theme.background || "#f9f9f9",
      text: theme.text || "#444",
      mainBackground: theme.mainBackground || "#fff",
      buttonBackground: brandColor,
      buttonBorder: brandColor,
      buttonText: theme.buttonText || "#fff",
    }
  
    return `
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center"
          style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Willkommen bei <strong>${escapedHost}</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 10px 20px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Bereit für deinen nächsten Run? 🏃
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                <a href="${url}" target="_blank"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                  Los geht's
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Wenn du diese E-Mail nicht angefordert hast, kannst du sie ignorieren.
        </td>
      </tr>
    </table>
  </body>
  `
  }