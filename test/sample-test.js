const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * 
 * This is the testing file for the application.
 * It contains basic tests for the smart contract, but this directory is also used for 
 * the UI testing
 * 
 * In Ethers, the getContractFactory gets the specified contract. await the deploy method 
 * await the deployed methd and then execute function assert the responses to see if the test passes or fails 
 * 
 * Similar to pytest. Arrange --> Act --> Assert
 * 
 */
describe("Blog", function () {
  it("Should create a post", async function () {
      const Blog = await ethers.getContractFactory("Blog");
      const blog = await Blog.deploy("My Blog");
      await blog.deployed();
      await blog.createPost("my first post", "12345");

      const posts = await blog.fetchPosts();
      expect(posts[0].title).to.equal("my first post");
  });

  it("Should edit a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My Blog");
    await blog.deployed();
    await blog.createPost("my second post", "12345");
    await blog.updatePost(1, "my updated post", "12345", true);
    const posts = await blog.fetchPosts();
    expect(posts[0].title).to.equal("my updated post");
  });

  it("Should add update the name", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My Blog");
    await blog.deployed();
    expect(await blog.name()).to.equal("My Blog");
    await blog.updateName("my updated name");
    expect(await blog.name()).to.equal("my updated name");
  });


});
