//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Bridge {
    address owner;
    address validator;
    IERC20 erc20;

    mapping(uint256 => bool) processedNonces;

    event swapInitialized(address indexed to, uint256 indexed amount);

    constructor(address _tokenAdress, address _validator) {
        owner = msg.sender;
        validator = _validator;
        erc20 = IERC20(_tokenAdress);
    }

    function swap(address _to, uint256 _amount) external {
        erc20.burn(msg.sender, _amount);
        emit swapInitialized(_to, _amount);
    }

    function redeem(address _to, uint256 _amount, uint256 _nonce, bytes memory _signature) external {
        require(processedNonces[_nonce] == false, "bad nonce");
        bytes32 hash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(
                    _to, 
                    _amount, 
                    _nonce))
            )
        );
        require(ECDSA.recover(hash, _signature) == validator, "bad signature");
        processedNonces[_nonce] = true;
        erc20.mint(_to, _amount);
    }
}
