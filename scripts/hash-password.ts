import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log(hash);

// In .env files every "$" must be escaped as "\$", otherwise Next's env
// loader (dotenv-expand) treats $2b/$10/... as variable references and
// corrupts the hash — admin login then fails silently.
console.error("\nFor .env.local (the $ signs are escaped):");
console.error(`ADMIN_PASSWORD_HASH="${hash.replace(/\$/g, "\\$")}"`);
