"use client";
import { useEffect } from "react";

export default function OrganisateurPage() {
  useEffect(() => {
    const targetUrl = window.location.port === "3002"
      ? `http://${window.location.hostname}:3000/home`
      : "/home";
    window.location.href = targetUrl;
  }, []);
  return null;
}
