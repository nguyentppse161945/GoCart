"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const [count, setCount] = useState(9);
  const [balloons, setBalloons] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const router = useRouter();

  // Countdown redirect
  useEffect(() => {
    if (count === 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, router]);

  // Generate random values once, only on client
  useEffect(() => {
    const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#fb7185"];

    const balloonData = Array.from({ length: 8 }, () => ({
      width: 10 + Math.random() * 20,
      height: 14 + Math.random() * 25,
      color: colors[Math.floor(Math.random() * colors.length)],
      top: Math.random() * 80,
      left: Math.random() * 90,
      duration: 3 + Math.random() * 3,
    }));

    const confettiData = Array.from({ length: 25 }, () => ({
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    }));

    setBalloons(balloonData);
    setConfetti(confettiData);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-100 text-orange-600 text-center px-6">
      {/* Floating shiny balloons */}
      {balloons.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-bounce-slow shadow-lg"
          style={{
            width: `${b.width}px`,
            height: `${b.height}px`,
            background: `radial-gradient(circle at 30% 30%, white, ${b.color})`,
            top: `${b.top}%`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}

      {/* Content */}
      <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">🎈 You may be lost 🎉</h1>
      <p className="text-lg mb-6 text-gray-600 max-w-md">
        The page you are looking for doesn’t exist or has been moved.  
        Don’t worry, we’ll bring you back to shopping fun!
      </p>

      {/* Countdown */}
      <p className="text-xl font-semibold text-orange-300 mb-6">
        Redirecting in <span className="text-2xl font-bold">{count}</span>...
      </p>

      <Link
        href="/"
        className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-orange-700 transition shadow-md hover:shadow-lg"
      >
        Go Back Home Now
      </Link>

      {/* Confetti effect */}
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((c, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full animate-fall"
            style={{
              left: `${c.left}%`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Extra Tailwind animations */}
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 4s infinite alternate;
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        @keyframes fall {
          0% {
            transform: translateY(-10%);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
