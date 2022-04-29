//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
/**
    In this contract, we are declaring a Blog. The Blog contract utilizes the Counters library to manage ids
    Each Blog has a name and an owner. A blog can contain unlimited number of posts from the owner. 

    Begin by declaring the instance variables
    Define the main data structure Post and its attributes
    Define the datastructure to hold the posts. In this case, a user can have any number of posts so 
    we create a mapping and use counters library to maintain the overall count. Memory Array Building pattern is recommended for dynamic storage
 */
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    address public owner;
    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
        uint id;
        string title;
        string content;
        bool published;
    }

    mapping(uint=>Post) private idToPost;
    mapping(string=>Post) private hashToPost;

    event PostCreated(uint id, string title, string hash);
    event PostUpdated(uint id, string title, string hash, bool published);

    constructor(string memory _name){
        console.log("Deploying Blog with name: ", name);
        name = _name;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

     /* updates the blog name */
    function updateName(string memory _name) public {
        name = _name;
    }

    /* transfers ownership of the contract to another address */
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
 
    function fetchPost(string memory hash) public view returns(Post memory) {
        return hashToPost[hash];
    }

    function createPost(string memory title, string memory hash) public onlyOwner
    {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.content = hash;
        post.published = true;
        hashToPost[hash] = post;
        emit PostCreated(postId, title, hash);
    }

    function updatePost(uint postId, string memory title, string memory hash, bool published) public onlyOwner
    {
        Post storage post = idToPost[postId];
        post.title = title;
        post.content = hash;
        post.published = published;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(postId, title, hash, published);
    }

    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();
        Post[] memory posts = new Post[](itemCount);
        for(uint i = 0; i<itemCount; i++){
            uint currentId = i+1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }

}
