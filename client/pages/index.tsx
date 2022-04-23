import { Box, Button, Card, Center, Input, Stack, Text } from "@mantine/core";
import type { NextPage } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { io } from "socket.io-client";
import Chat from "../components/Chat";

const socket = io("http://localhost:4000");

const Home: NextPage = () => {
  const [name, setName] = useState("s");
  const [room, setRoom] = useState("s");
  const [show, setShow] = useState(false);

  const joinRoom = () => {
    if (name !== "" && room !== "") {
      socket.emit("join_room", room);
      setShow(true);
    }
  };

  return (
    <Center
      sx={{
        marginTop: "200px",
        "@media (max-width: 500px)": {
          marginTop: "0",
        },
      }}
    >
      <Box
        sx={(theme) => ({
          minWidth: "400px",
          minHeight: "500px",
          background: theme.colors.gray[9],
          "@media (max-width: 500px)": {
            minWidth: "100vw",
            minHeight: "100vh",
            width: "100vw",
            height: "100vh",
          },
        })}
      >
        {!show ? (
          <Card
            sx={(theme) => ({
              "@media (max-width: 500px)": {
                height: "100vh",
              },
            })}
          >
            <Text transform="uppercase" size="lg" weight={700}>
              Join a room to chat
            </Text>

            <Card.Section>
              <Center>
                <Image src="/undraw_online_chat_re_c4lx.svg" alt="online-chat" width="300" height="300" />
              </Center>
            </Card.Section>

            <Stack>
              <Input
                value={name}
                placeholder="Your name"
                onChange={(event: FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)}
              />
              <Input
                value={room}
                placeholder="Room name"
                onChange={(event: FormEvent<HTMLInputElement>) => setRoom(event.currentTarget.value)}
              />
              <Button color="violet" fullWidth onClick={joinRoom}>
                Join Now
              </Button>
            </Stack>
          </Card>
        ) : (
          <Chat socket={socket} name={name} room={room} />
        )}
      </Box>
    </Center>
  );
};

export default Home;
