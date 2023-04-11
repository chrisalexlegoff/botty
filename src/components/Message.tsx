import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChatCompletionRequestMessage } from "openai";
import ReactMarkdown from "react-markdown";

type MessageProps = {
  message: ChatCompletionRequestMessage;
};

export const Message = ({ message }: MessageProps) => {
  const { data: session } = useSession();
  if (message.role === "system") return null;

  const isUser = message.role === "user";

  const imageUrl = isUser
    ? session?.user?.image
    : "/images/kisspng-robotic-arm-artificial-intelligence-chatbot-aibo-smart-robot-5a9d3873caea68.1369975215202530438312.png";

  return (
    <li
      className={clsx("w-full flex gap-4 p-4", {
        "bg-gray-700": isUser,
      })}
    >
      <div className="w-12 h-12">
        <Image src={imageUrl} width={42} height={42} alt="Avatar" />
      </div>
      <div className="prose dark:prose-invert w-full">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </li>
  );
};
