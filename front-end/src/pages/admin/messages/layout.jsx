import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Container from "../../../components/Container";
import { Send, SendHorizonal, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../../rest/admin/message";
import socket from "../../../socket";
import { AdminMessageProvider } from "./components/Provider";
import MessageList from "./components/MessageList";

export default function MessagesLayout() {
  const adminId = 1
  const navigate = useNavigate()
  const { id: activeId } = useParams()

  return (
    <AdminMessageProvider>
      <div className="h-screen w-full flex">
        <div className="w-72 h-full p-3">
          <h1 className="text-xl">Messages</h1>
          <MessageList activeId={activeId} />
        </div>
        <div className="flex-1 bg-base-100 h-full">
          <Outlet />
        </div>
      </div>
    </AdminMessageProvider>
  );
}
