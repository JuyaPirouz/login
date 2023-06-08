import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
const NAME_REGEXG = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
const PWS_REGEXG = /^.{4,24}$/;

export default function Login() {
  const { setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/profile";

  const nameRef = useRef();
  const errRef = useRef();
  const [names, setname] = useState({ user: "", valid: false, focus: false });
  const [pas, setpas] = useState({ user: "", valid: false, focus: false });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = NAME_REGEXG.test(names.user);
    setname((pev) => {
      return { ...pev, valid: result };
    });
  }, [names.user]);

  useEffect(() => {
    const result2 = PWS_REGEXG.test(pas.user);
    setpas((pev) => {
      return { ...pev, valid: result2 };
    });
  }, [pas.user]);

  const landleSub = async (e) => {
    e.preventDefault();
    if (!names.valid || !pas.valid) {
      setMsg("اصلاعات وارد شده صحیح نمی باشند");
      return;
    }
    try {
      const response = await axios.post(
        "http://185.213.167.156:8080/v1/service/ali/user/login",
        JSON.stringify({
          username: names.user,
          password: pas.user,
        }),
        {
          headers: {
            "Api-Key":
              "f2165063fdd61d4de33c389f5ea9aaa110097e2903c6b1b723cabe593886eebb",
          },
        }
      );
      const info = await response?.data?.info;
      const token = await response?.data?.info?.token;
      const stamsg = await response?.data?.resultMessage;
      const AuthData = await JSON.parse(response?.config?.data);

      localStorage.setItem("info", info);
      localStorage.setItem("token", token);

      await setAuth({
        username: AuthData.username,
        password: AuthData.password,
        token: token,
      });
      setname(() => {
        return { user: "", valid: false, focus: false };
      });
      setpas(() => {
        return { user: "", valid: false, focus: false };
      });

      setMsg(stamsg);

      setTimeout(() => {
        navigate(from, { required: true });
      }, 1000);
    } catch (error) {
      const stamsg = error?.message;
      setMsg(stamsg);
      setname(() => {
        return { user: "", valid: false, focus: false };
      });
      setpas(() => {
        return { user: "", valid: false, focus: false };
      });
    }
  };

  return (
    <>
      <main className="bg-blue0 text-center rounded-3xl font-4xl mt-12 mx-auto p-8 min-w-[38rem] max-w-[75%] max-h-[62rem] aspect-[3/4]">
        <section>
          <p
            ref={errRef}
            className={
              msg
                ? "font-black my-2 p-4 rounded-larger text-dark bg-red-600"
                : "hidden"
            }
          >
            {msg}
          </p>
          <h1>Login</h1>
          <form onSubmit={landleSub}>
            <div className=" mt-8">
              <label className="p-2 inline-block" htmlFor="username">
                username:{" "}
              </label>
              <br />
              <input
                type="text"
                name="username"
                id="username"
                ref={nameRef}
                value={names.user}
                autoComplete="off"
                required
                onChange={(e) =>
                  setname((pev) => {
                    return { ...pev, user: e.target.value };
                  })
                }
                onFocus={() =>
                  setname((pev) => {
                    return { ...pev, focus: true };
                  })
                }
                onBlur={() =>
                  setname((pev) => {
                    return { ...pev, focus: false };
                  })
                }
                className={`w-30 p-4 text-dark rounded-larger font-medium text-center text-4xl focus:bg-dark focus:text-blue0 ${
                  names.valid ? " green" : " none"
                }${names.valid || !names.user ? " none" : " red"}`}
              />
            </div>
            <br />
            <div>
              <label className="p-2 inline-block" htmlFor="pwd">
                password:{" "}
              </label>
              <br />
              <input
                type="password"
                name="pwd"
                id="pwd"
                autoComplete="off"
                required
                value={pas.user}
                onChange={(e) =>
                  setpas((pev) => {
                    return { ...pev, user: e.target.value };
                  })
                }
                onFocus={() =>
                  setpas((pev) => {
                    return { ...pev, focus: true };
                  })
                }
                onBlur={() =>
                  setpas((pev) => {
                    return { ...pev, focus: false };
                  })
                }
                className={`w-30 p-4 text-dark rounded-larger font-medium text-center text-4xl focus:bg-dark focus:text-blue0 ${
                  pas.valid ? " green" : " none"
                }${pas.valid || !pas.user ? " none" : " red"}`}
              />
            </div>
            <br />
            <button
              className={`focus:bg-dark focus:text-blue0 hover:bg-dark hover:text-blue0  mt-8 bg-white w-30 p-4 text-dark rounded-larger font-medium text-center text-4xl`}
            >
              login
            </button>
            <br />
            <p className="my-5">Need an Account?</p>
            <Link className="hover:text-dark font-black" to="/Signing">
              Signing
            </Link>
          </form>
        </section>
      </main>
    </>
  );
}