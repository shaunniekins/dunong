"use client";

import React from "react";
import { Button, Link } from "@nextui-org/react";
import { IoIosClose } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";

const MainHeader = () => {
  return (
    <>
      <header className="bg-white px-80 w-full h-16 flex items-center justify-center shadow-md fixed inset-x-0 top-0 z-50">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-10">
            <Link href="/" color="foreground" className="">
              <h1 className="font-semibold text-2xl">Dunong</h1>
            </Link>
            <div className="flex gap-10">
              <Link href="/" color="foreground" className="">
                Home
              </Link>
              <Link href="/library" color="foreground">
                Library
              </Link>
              <Link href="/flashcard-generator" color="foreground">
                AI Flashcard Generator
              </Link>
            </div>
          </div>
          <div className="flex justify-end items-end">
            <div className="flex items-center gap-1">
            <Button
                variant="light"
                radius="sm"
                className="bg-transparent text-lg"
              >
                Pricing
              </Button>
              <Button
                variant="light"
                radius="sm"
                className="bg-transparent text-lg"
              >
                Login
              </Button>
              <Button
                variant="light"
                radius="sm"
                className="bg-transparent text-lg"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
