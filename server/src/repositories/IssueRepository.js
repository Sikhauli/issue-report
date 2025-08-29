const Issue = require('../models/Issue');

class IssueRepository {
  constructor() {
    this.Issue = Issue;
  }

  async create(issueData) {
    try {
      const issue = new this.Issue(issueData);
      return await issue.save();
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.Issue.findById(id).populate('assignee reporter', 'name email');
    } catch (error) {
      throw new Error(`Failed to find issue: ${error.message}`);
    }
  }

  async findAll(filters = {}, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const issues = await this.Issue.find(filters)
        .populate('assignee reporter', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await this.Issue.countDocuments(filters);
      
      return {
        issues,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to find issues: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await this.Issue.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      ).populate('assignee reporter', 'name email');
    } catch (error) {
      throw new Error(`Failed to update issue: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.Issue.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete issue: ${error.message}`);
    }
  }

  async getStats(project = null) {
    try {
      const matchStage = project ? { project } : {};
      
      const stats = await this.Issue.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      return stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
    } catch (error) {
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }
}

module.exports = IssueRepository;