import React from "react";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
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
    mode: "onChange",
  });
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [seacrhTerm, setSearchTerm] = React.useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = React.useState<
    number | null
  >(null);
  const debauncedSearchTerm = useDebounce(seacrhTerm, 300);

  const { isFetching: isUsersFetching } = useQuery("users", getUsers, {
    onSuccess: (data) => setUsers(data),
  });
  const { mutate } = useMutation((newUser: IUser) => createUser(newUser), {
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Xəta baş verdi!",
      });
    },
    onSuccess: (data) => {
      Toast.fire({
        icon: "success",
        title: "İstifadəçi yaradıldı!",
      });

      onCloseCreateModal();
      setUsers([data, ...users]);
    },
  });
  const { mutate: mutateDelete } = useMutation((id: number) => deleteUser(id), {
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Xəta baş verdi!",
      });
    },
    onSuccess: () => {
      Toast.fire({
        icon: "success",
        title: "İstifadəçi silindi!",
      });

      setUsers(users.filter((user: IUser) => user.id !== selectedUserToDelete));
      onCloseDeleteModal();
    },
  });

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
    mutate({ id: Number(uuid()), ...data } as IUser);
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
    mutateDelete(selectedUserToDelete as number);
  };

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
            disabled={!methods.formState.isValid}
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
