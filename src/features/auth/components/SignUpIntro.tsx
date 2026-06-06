import { Link } from 'react-router-dom';

import MobileImage from '../assets/mobile_image.png';

function SignUpIntro() {
  return (
    <section className="relative hidden md:flex md:w-1/2 overflow-hidden items-center justify-center p-xl bg-surface-container">
      <div className="absolute inset-0 z-0">
        <img
          alt="NepWork Workspace"
          className="w-full h-full object-cover"
          src={MobileImage}
        />
        <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/30"></div>
      </div>
      <div className="relative z-10 glass-effect p-xl rounded-2xl  text-on-surface">
        <Link to="/" className="mb-lg flex items-center gap-sm">
          <img alt="NepWork Logo" className="h-10 w-10" src="favicon.svg" />
          <span className="font-headline text-headline-lg text-primary font-bold  tracking-tight">
            NepWork
          </span>
        </Link>

        <h2 className="font-headline text-headline-lg text-on-surface mb-md leading-tight">
          Elevate your career journey with the right connections.
        </h2>
        <p className="font-body text-body-lg text-on-surface-variant">
          Join a community of dedicated professionals and top-tier employers.
          Our marketplace is built on trust, efficiency, and the pursuit of
          excellence.
        </p>
        <div className="mt-xl flex gap-md">
          <div className="flex -space-x-3 overflow-hidden">
            <img
              alt="User 1"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBECaKtSZ0rw0iFj7OteByPC-HQyGWnxeMbALIc0Jv7CnqKQNe4qP9w4im7yAs-xf24nKo33yZy9T8C88VwcD4jGgGvx6DD2K_HAu9ko-jigeIZKI68Icy-TpbLNdL1P2phmjSVI8XeV39Sy_Q5jaJ1L6Ecc192rI4Uv7ZpPMKx6ziCHLrq7G0vv6j5AvBeQenBLBizyTrEP-in4KjTZGzBa_HbM9awQV33drP6DeeB80MX74y6rGjyumEgwhtF-4cPPzJiHVN2jizF"
            />
            <img
              alt="User 2"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxMRS1edvVY7RHcAqLdw8fyk32WPLTeUZ131ZddBMfbh-FJA8cERz2tKEdCpoXgpmqykzBahuGYmDNXjIgj4Mv3RZYzbB-NfnM88IfnmV0YMQFOwf4dA3IX8AMiyzVWMm9mqFfD_y6h9OSAp4Uj1Q2Z0Yo_xXkdFWQLZvwc62ZpLXEiO2ckl0xjZymSr5R2NrMw-sK6F3HAWOCpzezVHvw3HhkcNYuNRs3_oikGBHLVQVaNjyEmOYJi--pc2KUKi9-8Ze5s6nrh6U_"
            />
            <img
              alt="User 3"
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcXOpVQDGrZYBqBUZbFb85vTEX-OFCUJY8V-4Y4eKZQwmec7RVPqeB_wOgsozacqh7k_SAA5YxP--oYW9o3qys8-IZ3HeIu-Rem3FwQ6kCWLFLxCrI8GLIZjkkOAh3SbyE_ks3Lbo-piYcb3AkFINobF-6xNxjJ5tIXwE9OmcBHWabZ9Q3DYenK7zHeB2CrLlnSWhll4Ar3hRLn2mG5mO4SxMchWXIg-dg_52llA6tfr4nKs2J-XUZ8N9ymmPTGEeXCJgZmiiZ92fh"
            />
          </div>
          <p className="font-label-md text-label-md text-secondary self-center">
            Joined by 0,000+ experts
          </p>
        </div>
      </div>
    </section>
  );
}

export default SignUpIntro;
