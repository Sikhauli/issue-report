const jwt = require('jsonwebtoken');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  generateToken(userId) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }
  
  async register(userData) {
    
    if (!userData.email || !userData.password) {
      throw new Error('Invalid credentials');
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await this.userRepository.create(userData);
    const token = this.generateToken(user._id);
    
    return {
      user,
      token
    };
  }

  async login(email, password) {

    if (!email || !password) {
      throw new Error('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }
    const token = this.generateToken(user._id);
    
    return {
      user: user.toJSON(),
      token
    };
  }

  async getCurrentUser(userId) {
    return await this.userRepository.findById(userId);
  }
}

module.exports = UserService;