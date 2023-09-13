import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button } from "@common/components";
import { User as IUser } from "@/models/types";

interface IUserProps extends IUser {
  onClickDelete: (id: number) => void;
}

const User: React.FC<IUserProps> = ({ name, company, id, onClickDelete }) => {
  return (
    <div className="user">
      <div className="user__img">
        <img
          src="https://i.pinimg.com/736x/fd/b6/de/fdb6dea1b13458837c6e56361d2c2771.jpg"
          alt=""
        />
      </div>
      <div className="user__description">
        <Typography variant="h1">{name}</Typography>
        <Typography variant="p" color="gray">
          {company?.name ?? "--"}
        </Typography>
        <div className="user__actions">
          <Link to={`/user/${id}`}>
            <Button type="primary">
              <Typography variant="p" color="white">
                Redaktə et
              </Typography>
            </Button>
          </Link>
          <Button onClick={() => onClickDelete(id)} type="icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
              alt="delete"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default User;
