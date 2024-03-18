import React, { useContext, useEffect, useState } from "react";
import { authContext } from './../context/authContext'

import Edit from "../img/edit.png";
import Delete from "../img/delete.png";

import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from 'moment'
import axios from 'axios'

import Menu from './../components/Menu'

const Single = () => {
  
  const [posts, setPosts] = useState({})
  const location = useLocation().search
  const navigate = useNavigate()

  const pathname = useLocation().pathname;
  const postId = pathname ? pathname.split('/')[2] : null;

  const { currentUser } = useContext(authContext)

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/posts/${postId}`)
      navigate('/')
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/${postId}`)
        setPosts(res.data)
        console.log(posts)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [postId])

  return (
    <div className="single">
      <div className="content">
        <img src={posts?.img} alt="" />
        <div className="user">
          {posts.userImg && <img src={posts.userImg} alt="" />}
          <div className="info">
            <span>{posts.username}</span>
            <p>Posted {moment(posts.date).fromNow()}</p>
          </div>

          {currentUser.username === posts.username && (<div className="edit">
            <Link to={`/write?edit=2`} state={posts}>
              <img src={Edit} alt="" />
            </Link>
            <img onClick={handleDelete} src={Delete} alt="" />
          </div>)}

        </div>
        <h1>{posts.title}</h1>
        <p>{posts.description}</p>

      </div>
      <Menu cat={posts.cat} />
    </div>
  );
};

export default Single;