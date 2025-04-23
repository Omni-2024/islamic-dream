import {  Request,  Response } from 'express';
import User from '../models/user';
import generateToken from '../utils/generateToken';
import {client, serverClientChat} from "../config/streamConfig";
import {getStreamAdminRole} from "../utils/getStreamAdminRole";
import {verifyToken} from "../utils/firebase";
import admin from "../utils/firebase";



export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password ,role} = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });


        if (user) {
            console.log(`Registering user in Stream Video: ${user._id}`);

            await client.upsertUsers([{
                id: user.id,
                name: user.name,
                role: getStreamAdminRole({role:user.role}),
                image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`
            }]);

            await serverClientChat.upsertUsers([{
                id: user.id,
                name: user.name,
                role: getStreamAdminRole({role:user.role}),
                image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`
            }]);

            console.log("User registered successfully in Stream Video.");


            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
                isEmailVerified:user.isEmailVerified

            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
    const { tokenId } = req.body;

    try {
        const decodedToken = await verifyToken(tokenId);
        const { email, name, uid } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: uid, // Use uid as a placeholder password
                role: 'user' // Default role
            });

            if (user) {
                console.log(`Registering user in Stream Video: ${user._id}`);

                await client.upsertUsers([{
                    id: user.id,
                    name: user.name,
                    role: getStreamAdminRole({ role: user.role }),
                    image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`
                }]);

                await serverClientChat.upsertUsers([{
                    id: user.id,
                    name: user.name,
                    role: getStreamAdminRole({ role: user.role }),
                    image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.name}`
                }]);

                console.log("User registered successfully in Stream Video.");

                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id, user.role)
                });
            } else {
                res.status(400).json({ message: 'Invalid user data' });
            }
        } else {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        }
    } catch (error: any) {
        console.error("Firebase verification error:", error); // Log the error
        res.status(401).json({ message: 'Invalid token', error: error.message }); // Send the error message
    }
};
