import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";
import { UserValidation } from "@/lib/validation";
import {
  useGetUserById,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutation";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetUserById(id || "");
  const [profileImagePreview, setProfileImagePreview] = useState(
    currentUser.profilePicture || "/assets/icons/profile-placeholder.svg"
  );

  const {
    mutateAsync: updateUser,
    isError: errorUser,
  } = useUpdateUser();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio,
      file: "/assets/icons/profile-placeholder.svg",
    },
  });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  const FileUploader = ({ fieldChange }) => {
    const onDrop = useCallback(
      (acceptedFiles: FileWithPath[]) => {
        fieldChange(acceptedFiles);
        setProfileImagePreview(URL.createObjectURL(acceptedFiles[0]));
      },
      [fieldChange]
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".gif", ".jpg", ".jpeg"],
      },
    });

    return (
      <div
        {...getRootProps()}
        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
      >
        <input {...getInputProps()} />
        <img
          src={profileImagePreview}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    );
  };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  const onSubmit = (data) => {
    const requestUser = {
      ...data,
      userId: currentUser._id,
    };
    
    updateUser(requestUser);

    // const updatedUser = updateUser(data);
    if (errorUser)
      toast({
        title: "Somthing went wrong",
        duration: 2000,
      });

      navigate("/")
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-9 w-full max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploader fieldChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="mt-2 text-blue-400 text-sm">
              Change profile photo
            </span>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="shad-input" />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="shad-input" />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="shad-textarea custom-scrollbar"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
