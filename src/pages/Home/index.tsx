import React from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, Input, Button, Modal, Toast } from "@common/components";
import { getUsers, createUser, deleteUser } from "@common/api";
import { useDebounce, useSearch } from "@common/hooks";
import { schema } from "@common/schemas";
import { User as IUser } from "@/models/types";
import User from "./User";
import "./style.css";

const Home = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    mode: "onSubmit",
  });
  const [seacrhTerm, setSearchTerm] = React.useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = React.useState<
    number | null
  >(null);
  const debauncedSearchTerm = useDebounce(seacrhTerm, 300);

  const {
    data: users,
    isLoading: isUsersFetching,
    mutate: mutateGetUsers,
  } = useMutation("users", getUsers);
  const {
    isSuccess: isCreateSuccess,
    isLoading: isCreateLoading,
    isError: isCreateError,
    mutate,
  } = useMutation((newUser: IUser) => createUser(newUser));
  const {
    mutate: mutateDelete,
    isLoading: isDeleteLoading,
    isError: isDeleteError,
    isSuccess: iseDeleteSuccess,
  } = useMutation((id: number) => deleteUser(id));

  const filteredData: IUser[] = useSearch(
    users,
    debauncedSearchTerm as string,
    (user) => [user.name, user.company?.name]
  );

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStartCreateUser = () => {
    setIsCreateModalVisible(true);
  };

  const onCloseCreateModal = () => {
    setIsCreateModalVisible(false);
    methods.reset();
  };

  const onSubmitCreateUser = (
    data: Pick<IUser, "email" | "name" | "phone">
  ) => {
    mutate(data as IUser);
    onCloseCreateModal();
  };

  const handleDeleteUser = (id: number) => {
    setIsDeleteModalVisible(true);
    setSelectedUserToDelete(id);
  };

  const onCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setSelectedUserToDelete(null);
  };

  const submitDeleteUser = () => {
    onCloseDeleteModal();
    mutateDelete(selectedUserToDelete as number);
  };

  React.useEffect(() => {
    if (!isCreateLoading) {
      if (isCreateSuccess) {
        Toast.fire({
          icon: "success",
          title: "İstifadəçi yaradıldı!",
        });

        mutateGetUsers();
        return;
      }

      if (isCreateError) {
        Toast.fire({
          icon: "error",
          title: "Xəta baş verdi!",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateLoading, isCreateSuccess, isCreateError]);

  React.useEffect(() => {
    if (!isDeleteLoading) {
      if (iseDeleteSuccess) {
        Toast.fire({
          icon: "success",
          title: "İstifadəçi silindi!",
        });

        mutateGetUsers();
        return;
      }

      if (isDeleteError) {
        Toast.fire({
          icon: "error",
          title: "Xəta baş verdi!",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteLoading, isDeleteError, iseDeleteSuccess]);

  React.useEffect(() => {
    mutateGetUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="main">
        <div className="container">
          <div className="main__content">
            <div className="main__top">
              <Typography variant="h1">İstifadəçilər</Typography>
              <div>
                <Input
                  type="text"
                  id="search"
                  placeholder="Axtar..."
                  onChange={handleChangeInput}
                />
                <Button onClick={handleStartCreateUser} type="primary">
                  <Typography variant="p" color="white">
                    Yarat
                  </Typography>
                </Button>
              </div>
            </div>
            <div className="main__users">
              {!isUsersFetching ? (
                filteredData?.map((user: IUser) => (
                  <User
                    key={user?.id}
                    {...user}
                    onClickDelete={handleDeleteUser}
                  />
                ))
              ) : (
                <span className="loader"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isVisible={isCreateModalVisible}
        onClose={onCloseCreateModal}
        title="İstifadəçini yarat"
        subtitle="Xanaları tam doldurduğunuzdan əmin olun, əks halda istifadəçi yaradılmayacaq."
      >
        <form
          className="create__form"
          onSubmit={methods.handleSubmit(onSubmitCreateUser)}
        >
          <Input
            type="text"
            id="name"
            placeholder="Ad Soyad"
            register={methods.register}
            isNotValid={Object.keys(methods.formState?.errors).includes("name")}
          />
          <Input
            type="email"
            id="email"
            placeholder="Email"
            register={methods.register}
            isNotValid={Object.keys(methods.formState?.errors).includes(
              "email"
            )}
          />
          <Input
            type="tel"
            id="phone"
            placeholder="Mobil"
            register={methods.register}
            isNotValid={Object.keys(methods.formState?.errors).includes(
              "phone"
            )}
          />
          <Button
            htmlType="submit"
            type="primary"
            style={{ backgroundColor: "green" }}
          >
            <Typography variant="p" color="white">
              Yarat
            </Typography>
          </Button>
        </form>
      </Modal>

      <Modal
        isVisible={isDeleteModalVisible}
        onClose={onCloseDeleteModal}
        title="İstifadəçini sil"
        subtitle={`${
          users?.find((user: IUser) => user.id === selectedUserToDelete)?.name
        } adlı istifadəçini silmək istədiyinizə əminsiniz?`}
      >
        <div className="delete__modal">
          <Button type="secondary" onClick={onCloseDeleteModal}>
            <Typography variant="p" color="black">
              Imtina
            </Typography>
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "red" }}
            onClick={submitDeleteUser}
          >
            <Typography variant="p" color="white">
              Istifadəçini sil
            </Typography>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
