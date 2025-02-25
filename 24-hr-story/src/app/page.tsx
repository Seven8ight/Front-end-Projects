"use client";
import { useEffect, useState } from "react";
import ErrorElement from "./@Components/Error";
import { Cookie } from "next/font/google";
import ModalElement from "./@Components/Modal";

export type media = {
  id: number;
  name: string;
  type: "Video" | "Image";
  date: Date;
  duration?: number;
  size?: number;
  url: string | Base64URLString;
};

const cookie = Cookie({
  weight: "400",
  subsets: ["latin"],
});

const Page = (): React.ReactNode => {
  const [media, setMedia] = useState<media[]>([]),
    [itemCount, setCount] = useState<number>(0),
    [selected, setSelected] = useState<number>(0),
    [long, setLong] = useState<boolean>(false),
    [modal, setModal] = useState<boolean>(false);

  const handleMedia = (data: media): void => {
      setMedia((current) => [
        ...current,
        {
          id: data.id,
          name: data.name,
          type: data.type,
          url: data.url,
          date: data.date,
        },
      ]);
    },
    isFullMedia = (media: Partial<media>): media is media => {
      return (
        media.type !== undefined &&
        media.id !== undefined &&
        media.name !== undefined &&
        media.url !== undefined &&
        media.date !== undefined
      );
    },
    handleInputChange = async (
      event: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
      if (event.target.files) {
        Array.from(event.target.files).forEach((file) => {
          const obj: Partial<media> = {};

          try {
            if (file.type.includes("video")) {
              const video: HTMLVideoElement = document.createElement("video");
              video.src = URL.createObjectURL(file);

              video.addEventListener("loadedmetadata", () => {
                const duration = video.duration;
                if (duration > 60) {
                  setLong(true);
                } else {
                  const reader = new FileReader();

                  reader.onload = (e) => {
                    const dataurl = e.target?.result;
                    if (typeof dataurl == "string") {
                      obj.url = dataurl;
                      obj.id = itemCount;
                      obj.name = file.name;
                      obj.type = "Video";
                      obj.duration = duration;
                      obj.size = file.size;
                      obj.date = new Date();

                      setCount((count) => count + 1);
                    }
                    if (isFullMedia(obj)) handleMedia(obj);
                    else console.log("Failed");
                  };

                  reader.readAsDataURL(file);
                }
              });
            } else {
              const fileReader = new FileReader();

              fileReader.onload = (event) => {
                const base64String = event.target?.result;
                if (typeof base64String === "string") {
                  obj.url = base64String;
                  obj.id = itemCount;
                  obj.name = file.name;
                  obj.type = "Image";
                  obj.size = file.size;
                  obj.date = new Date();

                  setCount((count) => count + 1);
                  if (isFullMedia(obj)) {
                    handleMedia(obj);
                    console.log("Success");
                  } else {
                    console.log("Failed");
                  }
                }
              };

              fileReader.onerror = (error) => {
                console.log(error);
                console.log("Error reading file");
              };

              fileReader.readAsDataURL(file);
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    },
    handleOpen = (index: number): void => {
      setModal(true);
      setSelected(index);
    };

  useEffect(() => {
    Object.keys(localStorage).forEach((item) => {
      if (item.includes("Item")) {
        const objects: string[] = [localStorage.getItem(item) as string],
          resources = JSON.parse(objects[0]) as media;

        setMedia((current) => [
          ...current,
          {
            id: resources.id,
            type: resources.type,
            url: resources.url,
            name: resources.name,
            date: resources.date,
          },
        ]);
        setCount((count) => count + 1);
      }
    });
  }, []);
  useEffect(() => {
    media.forEach((File) => {
      localStorage.setItem(
        `Item ${File.id + 1}`,
        JSON.stringify({
          id: File.id,
          name: File.name,
          type: File.type == "Image" ? "Image" : "Video",
          url: File.url,
          date: File.date,
        })
      );
    });
  }, [media]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLong(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [long]);

  return (
    <>
      <header className="w-52 h-6 m-auto relative top-8 right-56">
        <h1 className="ml-4 underline text-lg">Story</h1>
      </header>
      <div
        id="container"
        className="w-[700px] h-[700px] border-2 rounded-xl m-auto p-5 relative top-10 bg-gradient-to-br from-[#f1e1c2] to-[#fcbc98] border-none"
      >
        <div id="list" className="w-full h-[auto] border-b-2 flex flex-wrap">
          <div id="add" className="w-12 h-12 hover:scale-105 transition-all">
            <label
              className={`w-full h-full text-lg text-center hover:cursor-pointer rounded-[50%] relative top-2 ${cookie.className}`}
            >
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,mp3,.mp4"
                onChange={handleInputChange}
              />
              +
            </label>
            <p className="text-center text-xs relative top-[12px]">Add</p>
          </div>
          {/* Create a dynamic list here */}
          {long && <ErrorElement />}
          {media.length > 0 &&
            media.sort((file1, file2) => file1.id - file2.id) &&
            media.map((file) => {
              const difference = Math.floor(
                (new Date().getTime() - new Date(file.date).getTime()) /
                  1000 /
                  60
              );
              let statement: string;

              if (difference < 60)
                if (difference == 1) statement = `${difference} min ago`;
                else if (difference == 0) statement = `Just Now`;
                else statement = `${difference} mins ago`;
              else if (Math.floor(difference / 60) == 1)
                statement = `About ${Math.floor(difference / 60)} hr ago`;
              else statement = `About ${Math.floor(difference / 60)} hrs ago`;

              return (
                <div
                  className="relative bottom-2 ml-5 mr-2 hover:scale-105 transition-all"
                  key={file.id}
                >
                  {file.type == "Image" ? (
                    <img
                      className="w-12 h-12 rounded-[50%] object-cover border-2 border-gray-700 hover:cursor-pointer"
                      src={file.url}
                      alt={file.name}
                      onClick={() => handleOpen(file.id)}
                    />
                  ) : (
                    <video
                      src={file.url}
                      playsInline={false}
                      className="w-10 h-10 rounded-[50%] object-cover border-2 border-gray-700 hover:cursor-pointer"
                      onClick={() => handleOpen(file.id)}
                    ></video>
                  )}
                  <p
                    className={`text-center text-xs m-auto ${cookie.className}`}
                  >
                    {statement}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      {modal && (
        <ModalElement items={media} handler={setModal} index={selected} />
      )}
    </>
  );
};

export default Page;
