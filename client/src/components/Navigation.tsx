import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { 
  Menu,
  PenTool,
  Dumbbell,
  Calendar,
  Clock,
  TrendingUp,
  Book,
  Heart,
  LogIn,
  UserPlus
} from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { href: "/practice", label: "Practice", icon: PenTool },
    { href: "/trainer", label: "Trainer", icon: Dumbbell },
    { href: "/study-plan", label: "Study Plan", icon: Calendar },
    { href: "/practice-test", label: "Practice Test", icon: Clock },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/learn", label: "Learn", icon: Book },
  ];

  const NavLink = ({ href, label, icon: Icon, mobile = false }: { href: string; label: string; icon: any; mobile?: boolean }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`${mobile ? "w-full justify-start" : ""} ${
            isActive ? "bg-forest-green text-white" : "text-warm-gray hover:text-forest-green"
          }`}
          onClick={() => mobile && setMobileOpen(false)}
        >
          <Icon className={`${mobile ? "mr-2 " : "mr-1 "}h-4 w-4`} />
          {label}
        </Button>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-nunito font-bold text-forest-green">EZ SAT</h1>
                <p className="text-xs text-warm-gray font-medium">Free SAT Prep</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navigationItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
                <Link href="/donate">
                  <Button className="bg-gold text-white hover:bg-yellow-500 ml-2">
                    <Heart className="mr-1 h-4 w-4" />
                    Donate
                  </Button>
                </Link>
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="ghost"
                  className="text-warm-gray hover:text-forest-green ml-2"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Auth buttons for non-authenticated users */}
          {!isAuthenticated && (
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                <Link href="/donate">
                  <Button className="bg-gold text-white hover:bg-yellow-500">
                    <Heart className="mr-1 h-4 w-4" />
                    Donate
                  </Button>
                </Link>
                <Button
                  onClick={() => window.location.href = "/api/login"}
                  variant="ghost"
                  className="text-warm-gray hover:text-forest-green"
                >
                  <LogIn className="mr-1 h-4 w-4" />
                  Login
                </Button>
                <Button
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-forest-green text-white hover:bg-green-600"
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-warm-gray" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {isAuthenticated && (
                    <>
                      {navigationItems.map((item) => (
                        <NavLink key={item.href} {...item} mobile />
                      ))}
                      <Link href="/donate">
                        <Button className="w-full justify-start bg-gold text-white hover:bg-yellow-500">
                          <Heart className="mr-2 h-4 w-4" />
                          Donate
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          window.location.href = "/api/logout";
                          setMobileOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start text-warm-gray hover:text-forest-green"
                      >
                        Logout
                      </Button>
                    </>
                  )}
                  
                  {!isAuthenticated && (
                    <>
                      <Link href="/donate">
                        <Button className="w-full justify-start bg-gold text-white hover:bg-yellow-500">
                          <Heart className="mr-2 h-4 w-4" />
                          Donate
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          window.location.href = "/api/login";
                          setMobileOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start text-warm-gray hover:text-forest-green"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          window.location.href = "/api/login";
                          setMobileOpen(false);
                        }}
                        className="w-full justify-start bg-forest-green text-white hover:bg-green-600"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
