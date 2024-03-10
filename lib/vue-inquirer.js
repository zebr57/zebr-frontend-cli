import inquirer from "inquirer";

const vueInquirer = function () {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "checkbox",
          message: "Check the feature.",
          choices: ["eslint", "Ts"],
          name: "feature",
        },
        {
          type: "confirm",
          message: "是否生成",
          name: "render",
        },
      ])
      .then((res) => {
        console.log(res);
        if (!res.render) return;
        console.log("create vue");
        resolve("zebr57/zebr-vue3-ts-template");
      });
  });
};
export default vueInquirer;
