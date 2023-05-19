import React, { useEffect, useRef, useState } from "react";
import { Link, json } from "react-router-dom";
import axios from "axios";

const NAME_REGEXG = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWS_REGEXG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function login() {
  const nameRef = useRef();
  const errRef = useRef();

  const [names, setname] = useState({ user: "", valid: false, focus: false });
  const [pas, setpas] = useState({ user: "", valid: false, focus: false });

  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
      setMsg("اصلاعات وارد شده صحیح نمی باشند")
      return
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
      // console.log(response);
      const stamsg = response?.data?.resultMessage;
      const stacode = response?.data?.resultCode;

      if (stacode === 1) {
        setSuccess(true);
        setMsg(stamsg);
      }

      setname((pev) => {
        return { user: "", valid: false, focus: false };
      });
      setpas((pev) => {
        return { user: "", valid: false, focus: false };
      });
      setMsg(stamsg);
    } catch (error) {
      const stamsg = error?.message;
      setMsg(stamsg);
      setname((pev) => {
        return { user: "", valid: false, focus: false };
      });
      setpas((pev) => {
        return { user: "", valid: false, focus: false };
      });
    }
  };

  return (
    <>
      <main className="main">
        {success ? (
          <section>
            <h1>{msg}</h1>
            <br />
            <p>
              go to{" "}
              <Link className="link" to="/">
                #home
              </Link>
            </p>
          </section>
        ) : (
          <section>
            <p ref={errRef} className={msg ? "msg" : "hidden"}>
              {msg}
            </p>
            <h1>Login</h1>
            <form onSubmit={landleSub}>
              <div className="part-inpot">
                <label className="label-inpout" htmlFor="username">
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
                  onFocus={(e) =>
                    setname((pev) => {
                      return { ...pev, focus: true };
                    })
                  }
                  onBlur={(e) =>
                    setname((pev) => {
                      return { ...pev, focus: false };
                    })
                  }
                  className={`ss ${names.valid ? " green" : " none"}${
                    names.valid || !names.user ? " none" : " red"
                  }`}
                />
              </div>
              <br />
              <div className="part-inpot">
                <label className="label-inpout" htmlFor="pwd">
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
                  onFocus={(e) =>
                    setpas((pev) => {
                      return { ...pev, focus: true };
                    })
                  }
                  onBlur={(e) =>
                    setpas((pev) => {
                      return { ...pev, focus: false };
                    })
                  }
                  className={`ss ${pas.valid ? " green" : " none"}${
                    pas.valid || !pas.user ? " none" : " red"
                  }`}
                />
              </div>
              <br />
              <button className="sub">sign up</button>
              <br />
              <p className="p-link">Need an Account?</p>
              <Link className="link" to="/signup">
                Sign Up
              </Link>
            </form>
          </section>
        )}
      </main>
    </>
  );
}
