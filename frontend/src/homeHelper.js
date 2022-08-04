import deer from "./imgs/deer.png";
import zombie from "./imgs/zombie.png";
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

export function gridToTable(grid, items) {
  var lstTr = [];

  //item contents
  /*item: "z",
          x: 0,
          y: 0,
          color: "#d8d8d8",
          path: [
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 2],
          ],*/
  for (var r in grid) {
    for (var c in grid[r]) {
      var tdTile = "";

      if (grid[r][c] == 1) {
        tdTile = this.getImg(tree);
      }

      var zombieOrDeer = "";
      var tileBackColor = "green.400";
      for (var i in items) {
        if (items[i]["y"] == r && items[i]["x"] == c) {
          zombieOrDeer = items[i]["item"];
        }
        var path = items[i]["path"];
        if (path.length > 0) {
          for (var p in path) {
            if (path[p][0] == c && path[p][1] == r) {
              tileBackColor = items[i]["color"];
              break;
            }
          }
        }
      }

      var thing = "";
      switch (zombieOrDeer) {
        case "z":
          thing = this.getImg(zombie);
          break;
        case "d":
          thing = this.getImg(deer);
          break;
      }
      var topBuffer = 100;
      var leftBuffer = 20;
      lstTr.push(
        <div
          style={{
            position: "absolute",
            top: r * 40 + topBuffer,
            left: c * 40 + leftBuffer,
            backgroundColor: tileBackColor,
            zIndex: 1,
          }}
        >
          <Box boxShadow="dark-lg" key={uuidv4()} width="8" height="8">
            <Stack>
              {thing}
              {tdTile}
            </Stack>
          </Box>
        </div>
      );
    }

    /*  */

    // lstTr.push(lstTd);
  }

  return (
    <Box w="800px" h="600px">
      {lstTr}
    </Box>
  );
}

export function getImg(url) {
  return <Image src={url} alt="" w="5" h="5" zIndex={2} />;
}
