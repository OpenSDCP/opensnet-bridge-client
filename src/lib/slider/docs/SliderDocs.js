import React, { Component } from "react";
import { Slider } from "../Slider";

// Docs
import { DocsSection } from "../../../components/docs/DocsSection";

export const SliderDocs = () => (
  <DocsSection
    title="Slider"
    id="slider"
    demos={<SliderDemo />}
    code={code}
    api={[
      {
        title: "value (string)",
        description: "The slider's current value."
      },
      {
        title: "label (string)",
        description: "A description of what information to enter."
      },
      {
        title: "name (string)",
        description: "Unique identifier."
      },
      {
        title: "onChange (func)",
        description:
          "Event handler (gets fired when the user clicks the slider)."
      },
      {
        title: "...otherProps",
        description: "Other (HTML5) props that should be passed to the slider."
      }
    ]}
  />
);

const code = `
class SliderDemo extends Component {
    state = {
      amount: 15
    };
  
    handleClick = ({ target: { value } }) => {
      this.setState({
        amount: parseInt(value, 10)
      });
    };
  
    render() {
      const { amount } = this.state;
      const { handleClick } = this;
      return (
        <Slider
          label="Amount:"
          name="currentAmount1"
          value={amount}
          onChange={handleClick}
          range={10}
          min={0}
          max={100}
        />
      );
    }
  }
`;

class SliderDemo extends Component {
  state = {
    amount: 15
  };

  handleClick = ({ target: { value } }) => {
    this.setState({
      amount: parseInt(value, 10)
    });
  };

  render() {
    const { amount } = this.state;
    const { handleClick } = this;
    return (
      <Slider
        label="Amount:"
        name="currentAmount1"
        value={amount}
        onChange={handleClick}
        range={10}
        min={0}
        max={100}
      />
    );
  }
}