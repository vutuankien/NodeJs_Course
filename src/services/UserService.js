const User = require('../Models/user.model');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const generalAccessToken = (data) => {
    const accessToken = jwt.sign(
        { data },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
    );
    return accessToken;
}

const generalRefreshToken = (data) => {
    const refreshToken = jwt.sign(
        { data },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );
    return refreshToken;
}

const createUserService = ({ email, name, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check email format
            const isValid = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(email);
            if (!isValid) {
                resolve({
                    status: 'error',
                    message: 'Invalid email format',
                });
            }

            // Check if email or name already exists
            const isCheckEmail = await User.findOne({ email });
            const isCheckName = await User.findOne({ name });

            if (isCheckName) {
                resolve({
                    status: 'error',
                    message: 'Name already exists',
                });
            }
            if (isCheckEmail) {
                resolve({
                    status: 'error',
                    message: 'Email already exists',
                });
            }

            // Hash password
            const hashPassword = bcrypt.hashSync(password, 10);

            // Create new user
            const user = await User.create({
                email,
                password: hashPassword,
                name
            });

            resolve({
                status: 'success',
                message: 'User created successfully',
                data: {
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            reject({
                status: 'error',
                message: 'Error creating user',
                error: error.message,
            });
        }
    });

};

const loginUserService = async ({ email, password }) => {
    try {
        if (!email || !password) {
            return {
                status: 'error',
                message: 'Missing required fields',
            };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 'error',
                message: 'Invalid email or password',
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                status: 'error',
                message: 'Invalid email or password',
            };
        }

        const accessToken = generalAccessToken({ isAdmin: user.isAdmin, _id: user._id });
        const refreshToken = generalRefreshToken({ isAdmin: user.isAdmin, _id: user._id });

        return {
            status: 'success',
            message: 'Login successful',
            data: {
                email: user.email,
                name: user.name,
                accessToken,
                refreshToken,
            },
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error logging in',
            error: error.message,
        };
    }
};


const getDetailUserService = async (id) => {
    try {
        const findUser = await User.findById(id).lean();
        if (!findUser) {
            return {
                status: 'error',
                message: 'User not found',
            };
        }
        return {
            status: 'success',
            message: 'User details retrieved successfully',
            data: findUser,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error getting user details',
            error: error.message,
        };

    }
}

const searchUserService = async (email) => {
    try {
        const findEmail = await User.find({ email }).lean();
        if (!findEmail) {
            return {
                status: 'error',
                message: 'User not found',
            };
        }
        return {
            status: 'success',
            message: 'User found',
            data: findEmail,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error searching user',
            error: error.message,
        };
    }
}

const updateUserService = async (id, { email, name }) => {
    try {
        if (!email && !name) {
            return {
                status: 'error',
                message: 'At least one field is required to update',
            };
        }

        const existingUser = await User.findById(id).lean();
        if (!existingUser) {
            return {
                status: 'error',
                message: 'User not found',
            };
        }

        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email }).lean();
            if (emailExists) {
                return {
                    status: 'error',
                    message: 'Email already exists',
                };
            }
        }

        if (name && name !== existingUser.name) {
            const nameExists = await User.findOne({ name }).lean();
            if (nameExists) {
                return {
                    status: 'error',
                    message: 'Name already exists',
                };
            }
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            { email, name },
            { new: true }
        ).lean();

        return {
            status: 'success',
            message: 'User updated successfully',
            data: updateUser,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error updating user',
            error: error.message,
        };
    }
};

const deleteUserService = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id).lean();
        if (!user) {
            return {
                status: 'error',
                message: 'User not found',
            };
        }
        return {
            status: 'success',
            message: 'User deleted successfully',
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error deleting user',
            error: error.message,
        };
    }
};

const getAllUserService = async () => {
    try {
        const users = await User.find({}).lean();
        return {
            status: 'success',
            message: 'Users retrieved successfully',
            data: users,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error retrieving users',
            error: error.message,
        };
    }
};

const refreshTokenValid = async (token) => {
    try {
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        const newAccessToken = generalAccessToken({
            isAdmin: user.data.isAdmin,
            _id: user.data._id,
        });

        return {
            status: 'success',
            message: 'Refresh token is valid',
            data: {
                accessToken: newAccessToken,
            },
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Invalid refresh token',
            error: error.message,
        };
    }
};

module.exports = { createUserService, getAllUserService, loginUserService, getDetailUserService, searchUserService, updateUserService, deleteUserService, refreshTokenValid };
