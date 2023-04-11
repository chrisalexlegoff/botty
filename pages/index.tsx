import { Loader, Message, TextArea, ProtectedLayout } from "../src/components";
import { useMutation } from "@tanstack/react-query";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { FormEvent, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const createChatCompletion = (messages: ChatCompletionRequestMessage[]) => {
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  return openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
};

export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const UlRef = useRef<HTMLUListElement>(null);

  const mutation = useMutation(
    (newMessages: ChatCompletionRequestMessage[]) =>
      createChatCompletion(newMessages),
    {
      onSuccess: (response) => {
        const newText = response.data.choices[0].message?.content;

        if (!newText) {
          return;
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: newText,
          },
        ]);

        scrollToLastMessage();
      },
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = String(formData.get("user"));

    const newMessage = {
      role: "user",
      content: user,
    } satisfies ChatCompletionRequestMessage;

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    scrollToLastMessage();
    e.currentTarget.reset();
    mutation.mutate(newMessages);
  };

  const scrollToLastMessage = () => {
    setTimeout(() => {
      UlRef.current?.children[
        UlRef.current?.children.length - 1
      ].scrollIntoView();
    }, 1);
  };

  const { data: session, status: sessionStatus } = useSession();
  console.log(session);

  return (
    <ProtectedLayout>
      <main className="m-auto max-w-3xl flex flex-col px-2 py-8 h-full">
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <div className="flex justify-between p-2">
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              Botty
            </h1>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-white disabled:dark:bg-red-800 disabled:dark:text-gray-400 disabled:text-gray-400 disabled:bg-red-300 disabled:cursor-not-allowed bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            >
              Quitter
            </button>
          </div>

          <ul ref={UlRef} className="flex flex-col flex-1">
            {messages.map((message, i) => (
              <Message message={message} key={message.content + i} />
            ))}
            {messages.length === 0 && (
              <li>Pas encore de messages, commencer une conversation!</li>
            )}
            {mutation.isLoading && (
              <li className="flex items-center w-full p-4">
                <Loader />
                <p className="text-gray-300 animate-pulse ml-3">
                  Botty réfléchit...
                </p>
              </li>
            )}
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={mutation.isLoading}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <TextArea name="user" label="Votre message" />
            </div>
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="text-white disabled:dark:bg-blue-800 disabled:dark:text-gray-400 disabled:text-gray-400 disabled:bg-blue-300 disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Envoyer
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="text-white disabled:dark:bg-red-800 disabled:dark:text-gray-400 disabled:text-gray-400 disabled:bg-red-300 disabled:cursor-not-allowed bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                  Clear fil
                </button>
              )}
            </div>
          </fieldset>
        </form>
      </main>
    </ProtectedLayout>
  );
}
