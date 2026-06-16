"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfilePage() {

  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [profileImage,
  setProfileImage] =
    useState("");

    const [image,setImage] = useState<File | null>(null);

  useEffect(() => {

    axios
      .get("/api/profile")

      .then((res) => {

        setName(
          res.data.name || ""
        );

        setBio(
          res.data.bio || ""
        );

        setLocation(
          res.data.location || ""
        );

        setProfileImage(
          res.data.profileImage || ""
        );

      });

  }, []);

  const uploadImage =
async () => {

  if (!image) {
    return profileImage;
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    image
  );

  const response =
    await axios.post(
      "/api/upload",
      formData
    );

  return response.data.url;
};

  const handleSave =
    async () => {

        const uploadedUrl =
        await uploadImage();

        await axios.patch(
        "/api/profile",
        {
            name,
            bio,
            location,

            profileImage:
            uploadedUrl,
        }
        );

      alert(
        "Profile updated!"
      );
    };

  return (

    <main className="
      p-10
      max-w-xl
      mx-auto
    ">

      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">

        My Profile

      </h1>

      {profileImage && (

        <img

            src={profileImage}

            alt="Profile"

            className="w-32 h-32 rounded-full object-cover mb-6 mx-auto"
            />

        )}

      <input
        className="
          w-full
          border
          p-3
          rounded
          mb-4
        "

        value={name}

        onChange={(e) =>
          setName(
            e.target.value
          )
        }

        placeholder="Name"
      />

      <input

        type="file"

        accept="image/*"

        onChange={(e) =>
            setImage(
            e.target.files?.[0]
            || null
            )
        }

        className="
            w-full
            border
            p-3
            rounded
            mb-4
        "

        />

      <textarea

        className="
          w-full
          border
          p-3
          rounded
          mb-4
        "

        value={bio}

        onChange={(e) =>
          setBio(
            e.target.value
          )
        }

        placeholder="Bio"
      />

      <input

        className="
          w-full
          border
          p-3
          rounded
          mb-4
        "

        value={location}

        onChange={(e) =>
          setLocation(
            e.target.value
          )
        }

        placeholder="Location"

      />

      <button

        onClick={
          handleSave
        }

        className="
          w-full
          bg-black
          text-white
          p-3
          rounded
        "

      >

        Save Profile

      </button>

    </main>

  );
}