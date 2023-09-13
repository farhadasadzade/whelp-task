import React from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Typography, Button, Toast } from "@common/components";
import { schema } from "@common/schemas";
import { getUserById, updateUser } from "@common/api";
import { User } from "@/models/types";
import "./style.css";

const Edit = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const {
    mutate: mutateGetUser,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    data: userData,
  } = useMutation(() => getUserById(Number(userId)));
  const {
    mutate: mutateUpdateUser,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useMutation((user: User) => updateUser(user));

  const onSubmitUpdateUser = (data: Pick<User, "email" | "name" | "phone">) => {
    mutateUpdateUser({ ...userData, ...data } as User);
  };

  React.useEffect(() => {
    mutateGetUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  React.useEffect(() => {
    if (!isGetLoading && isGetSuccess) {
      methods.reset({
        name: userData?.name,
        email: userData?.email,
        phone: userData?.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetSuccess, isGetLoading]);

  React.useEffect(() => {
    if (!isUpdateLoading) {
      if (isUpdateSuccess) {
        Toast.fire({
          icon: "success",
          title: "İstifadəçi yaradıldı!",
        });

        navigate("/", { replace: true });
        return;
      }

      if (isUpdateError) {
        Toast.fire({
          icon: "error",
          title: "Xəta baş verdi!",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, isUpdateLoading]);

  return (
    <div className="edit">
      <div className="container">
        <div className="edit__content">
          <Typography variant="h1">İstifadəçini redaktə et</Typography>
          <form
            onSubmit={methods.handleSubmit(onSubmitUpdateUser)}
            className="create__form"
          >
            <Input
              id="name"
              type="text"
              label="Ad Soyad"
              register={methods.register}
              isNotValid={Object.keys(methods.formState?.errors).includes(
                "name"
              )}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              register={methods.register}
              isNotValid={Object.keys(methods.formState?.errors).includes(
                "email"
              )}
            />
            <Input
              id="phone"
              type="tel"
              label="Telefon"
              register={methods.register}
              isNotValid={Object.keys(methods.formState?.errors).includes(
                "phone"
              )}
            />
            <Button htmlType="submit" type="primary">
              <Typography variant="p" color="white">
                Məmulatları yenilə
              </Typography>
            </Button>
            <Button
              onClick={() => navigate("/", { replace: true })}
              type="secondary"
            >
              <Typography variant="p" color="black">
                Geri qayit
              </Typography>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
