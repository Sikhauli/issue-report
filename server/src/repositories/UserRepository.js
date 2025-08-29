const User = require('../models/User');

class UserRepository {
  constructor() {
    this.User = User;
  }

  async create(userData) {
    try {
      const user = new this.User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await this.User.findOne({ email });
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.User.findById(id)
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await this.User.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      )
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}

module.exports = UserRepository;