import React from "react";
import deer from "./imgs/deer.png";
import tree from "./imgs/tree.png";
import {
  Wrap,
  WrapItem,
  Box,
  Center,
  Image,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

class HomePage extends React.Component {
  state = {};

  gridToTable(grid) {
    var lstTr = [];

    for (var r in grid) {
      var lstTd = [];
      for (var c in grid[r]) {
        var tdTile = "";
        switch (grid[r][c]) {
          case 1:
            tdTile = this.getImg(tree);
            break;
        }

        lstTd.push(
          <Td key={uuidv4()} bd="green.400">
            {tdTile}
          </Td>
        );
      }

      lstTr.push(<Tr key={uuidv4()}>{lstTd}</Tr>);
    }

    return (
      <TableContainer>
        <Table>
          <Tbody>{lstTr}</Tbody>
        </Table>
      </TableContainer>
    );
  }

  getImg(url) {
    return (
      <Box boxSize="sm">
        <Image src={url} alt="" w="2" h="2" />
      </Box>
    );
  }

  render() {
    var showGrid = this.gridToTable([
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    return (
      <Center w="100%" h="100%">
        <Box bg="green.200" w="800px" h="600px">
          {showGrid}
        </Box>
      </Center>
    );
  }
}

export default HomePage;
