import inquirer from "inquirer";

const reactInquirer = function () {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        // {
        //   type: "checkbox",
        //   message: "Check the feature.",
        //   choices: ["eslint", "Ts"],
        //   name: "feature",
        // },
        {
          type: "confirm",
          message: "是否生成",
          name: "render",
        },
      ])
      .then((res) => {
        if (!res.render) return;
        console.log("create react");
        resolve("zebr57/zebr-react-template");
        
      });
  });
};

export default reactInquirer;
