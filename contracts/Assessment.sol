// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
   uint cost=0;
   function destination(uint fav_dest) public  {
    cost=0;
      if(fav_dest==1){
        cost+=1000;
      }
      else if(fav_dest==2){
        cost+=2000;
      }
      else if(fav_dest==3){
        cost+=3000;
      } 
      else{
        cost+=4000;
      }
   }
   function hotel(uint star) public {
    if(star==3){
      cost+=200;
    }
    else if(star==4){
      cost+=300;
    }
    else{
      cost+=500;
    }
    
   }
   function getcost() public view returns(uint){
    return cost;
   }
}
