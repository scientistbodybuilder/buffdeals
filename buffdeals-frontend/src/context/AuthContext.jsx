import { useState, useEffect, createContext, useContext } from "react";
import supabase from "../supabaseClient"
const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    const signUp = async (email, password) => {
        const { data, error } = await supabase.from("users").select("*")
        if ( error ) {
            console.log(`error fetching users: ${error}`)
            return {success: false}
        }  else {
            console.log(`users: ${data}`)
            let existingEmail = 0
                for (let i=0; i< data.length; i++){
                    console.log(`email: ${data[i].email}`)
                    if (data[i].email === email) {
                        //existing email
                        existingEmail = existingEmail + 1
                        break
                    }
                }
                if (existingEmail > 0) {
                    //prompt that an account exist with that email
                    console.log(`Account with email: ${email} already exists`)
                    
                    return {success: false, existingEmail: true}
                } else {
                    // make the account
                    console.log(`email: ${email}`)
                    console.log(`password: ${password}`)
                    const { data, error} = await supabase.auth.signUp({
                        email: email,
                        password: password
                    })

                    if (error) {
                        console.log(`Auth signup error: ${error}`)
                        return {success: false}
                    } else {
                        // register in user table
                        const { data, error } = await supabase.from("users").insert({
                            email: email,
                            password: password
                        }).single()
                        if (error) {
                            console.log('error inserting into user table')
                            return {success: false}
                        } 
                        return {success: true, data}
                    }
                }

        }

        
    }

    useEffect(()=> {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    },[])

    const signOut = () => {
        const { error } = supabase.auth.signOut()
        if (error) {
            console.error("Error during sign out", error)
        };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.from("users").select('*')
        if (error) {
            console.log(`sign in error retrieving user data: ${error}`)
            return {success: false}
        } else {
            if(data) {
                for (let i=0; i< data.length; i++){
                    if (data[i].email == email) {
                        if (data[i].password == password) {
                            // this success actually exist. now sign them in

                            const { data, error } = await supabase.auth.signInWithPassword({
                                email: email,
                                password: password
                            })
                            if (error){
                                console.log(`supabase signin error: ${error}`)
                                return {success: false}
                            } else {
                                //signed in success
                                return {success: true, data}
                            }

                        } else {
                            console.log('correct email, wrong password')
                            return {success: false, existingAcc: true}
                        }
                    }
                }

            } else {
                //there are no users, so need to create a new account
                return {success: false}
            }
        }
    }

    return( <AuthContext.Provider value={{ session, signUp, signOut, signIn }}>
                {children}
            </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}