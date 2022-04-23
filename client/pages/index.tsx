import { Box, Button, Card, Center, Image, Input, Stack, Text } from "@mantine/core";
import type { NextPage } from "next";
import { FormEvent, useState } from "react";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <Center sx={{ marginTop: "200px" }}>
      <Box sx={{ maxWidth: "400px", minWidth: "400px" }}>
        <Card shadow="sm" p="lg">
          <Text transform="uppercase" size="lg" weight={700}>
            Join a room to chat
          </Text>

          <Card.Section>
            <Center>
              <Image src="/undraw_online_chat_re_c4lx.svg" alt="online-chat" sx={{ padding: "30px", width: "300px" }} />
            </Center>
          </Card.Section>

          <Stack>
            <Input
              placeholder="Your name"
              onChange={(event: FormEvent<HTMLInputElement>) => setName(event.currentTarget.value)}
            />
            <Input
              placeholder="Room name"
              onChange={(event: FormEvent<HTMLInputElement>) => setRoom(event.currentTarget.value)}
            />
            <Button color="violet" fullWidth>
              Join Now
            </Button>
          </Stack>
        </Card>
      </Box>
    </Center>
  );
};

export default Home;
