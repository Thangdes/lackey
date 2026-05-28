"use client";

import React from "react";
import { Phone, Facebook } from "lucide-react";

export default function FloatingWidget() {
  
  return null;

  const contacts = [
    {
      id: "phone",
      icon: <Phone className="w-5 h-5" />,
      href: "tel:0919600801",
      bgColor: "bg-green-500 hover:bg-green-600",
      title: "Hotline: 091 960 08 01",
    },
    {
      id: "zalo",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.156.468.24.864.708.708l3.032-.892A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm3.5 13.5h-7a.5.5 0 010-1h7a.5.5 0 010 1zm0-3h-7a.5.5 0 010-1h7a.5.5 0 010 1zm0-3h-7a.5.5 0 010-1h7a.5.5 0 010 1z"/>
        </svg>
      ),
      href: "https://zalo.me/0919600801",
      bgColor: "bg-blue-500 hover:bg-blue-600",
      title: "Chat Zalo",
    },
    {
      id: "facebook",
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com/profile.php?id=61581934494103",
      bgColor: "bg-blue-600 hover:bg-blue-700",
      title: "Facebook",
    },
    {
      id: "messenger",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.446 5.51 3.707 7.215V22l3.39-1.862c.905.251 1.864.386 2.903.386 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.993 12.493l-2.558-2.73-4.993 2.73 5.492-5.831 2.623 2.73 4.928-2.73-5.492 5.831z"/>
        </svg>
      ),
      href: "https://m.me/61581934494103",
      bgColor: "bg-blue-500 hover:bg-blue-600",
      title: "Messenger",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {contacts.map((contact) => (
        <a
          key={contact.id}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          title={contact.title}
          className={`${contact.bgColor} text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl`}
        >
          {contact.icon}
        </a>
      ))}
    </div>
  );
}
