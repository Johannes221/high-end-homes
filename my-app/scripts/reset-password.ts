// Script zum Zurücksetzen eines User-Passworts
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function resetPassword() {
  const email = "admin@highendhomes.de";
  const newPassword = "HighEnd2026!";

  const gehashtesPasswort = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { password: gehashtesPasswort },
    select: { id: true, name: true, email: true },
  });

  console.log("Passwort zurückgesetzt für:", user.email);
  console.log("Neues Passwort:", newPassword);
}

resetPassword()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
