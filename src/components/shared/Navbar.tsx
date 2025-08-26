
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Sparkles, User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { handleLogout } from "@/app/admin/actions";


const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Proposal AI", href: "/proposal" },
  { name: "Contact", href: "/contact"}
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  const isNavItemActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const onLogout = async () => {
    await handleLogout();
  }

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-4 inset-x-0 max-w-4xl mx-auto z-50"
    >
      <div className="bg-background/80 backdrop-blur-lg rounded-full border border-primary/10 shadow-lg px-6 py-3 shadow-black/5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
            <span className="font-headline font-bold text-xl whitespace-nowrap">Aether</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isNavItemActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
             {!loading && (
              user ? (
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin" title="Admin">
                      <User className="h-5 w-5" />
                    </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/admin/login" title="Admin Login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )
            )}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-xl p-4"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  isNavItemActive(item.href) ? "text-primary" : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
             {!loading && (
              user ? (
                <>
                <Link href="/admin" onClick={() => setIsOpen(false)} className={cn("text-lg font-medium transition-colors hover:text-primary", isNavItemActive("/admin") ? "text-primary" : "text-foreground")}>Dashboard</Link>
                <Button onClick={onLogout} variant="ghost" className="justify-start p-0 text-lg text-foreground hover:text-primary">
                    <LogOut className="mr-2 h-5 w-5"/>
                    Logout
                </Button>
                </>
              ) : (
                <Link href="/admin/login" onClick={() => setIsOpen(false)} className={cn("text-lg font-medium transition-colors hover:text-primary", isNavItemActive("/admin/login") ? "text-primary" : "text-foreground")}>Admin</Link>
              )
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
     <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-[0%] z-50"
        style={{ scaleX }}
      />
    </>
  );
}