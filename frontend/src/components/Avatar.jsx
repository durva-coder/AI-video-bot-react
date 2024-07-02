/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/667d2dc7ab338d43c837c83c.glb -o src/components/Avatar.jsx -r public 
*/

import React, { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpeechRecognitionContext } from "../hooks/useSpeechToText";
import * as THREE from "three";
import { Polly } from "aws-sdk";
import { Buffer } from "buffer";

const polly = new Polly({
  credentials: {
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  },
  region: process.env.REACT_APP_REGION,
});

const corresponding = {
  X: "viseme_PP",
  P: "viseme_PP",
  B: "viseme_PP",
  M: "viseme_PP",
  F: "viseme_FF",
  V: "viseme_FF",
  TH: "viseme_TH",
  D: "viseme_DD",
  T: "viseme_DD",
  N: "viseme_DD",
  K: "viseme_kk",
  G: "viseme_kk",
  NG: "viseme_kk",
  CH: "viseme_CH",
  J: "viseme_CH",
  SH: "viseme_CH",
  S: "viseme_SS",
  Z: "viseme_SS",
  L: "viseme_nn",
  R: "viseme_RR",
  AA: "viseme_aa",
  E: "viseme_E",
  I: "viseme_I",
  O: "viseme_O",
  U: "viseme_U",
  SIL: "viseme_sil",
  TH_: "viseme_TH_", // for "th" in "this" or "that"
  CH_: "viseme_CH_", // for "ch" in "church" or "change"
  A_CAT: "viseme_A_CAT", // for "a" in "cat"
  A_FACE: "viseme_A_FACE", // for "a" in "face"
};

export function Avatar(props) {
  const {
    responseData,
    setIsSpeaking,
    setIsListening,
    isSpeaking,
    startListening,
    setResponseData,
  } = useSpeechRecognitionContext();
  const [cues, setCues] = useState([]);
  const startTimeRef = useRef(0);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  const smoothMorphTarget = true;
  const morphTargetSmoothing = 0.5;

  useEffect(() => {
    const ssmlText = `<speak>${responseData}</speak>`;

    const params = {
      TextType: "ssml",
      OutputFormat: "mp3",
      Text: ssmlText,
      VoiceId: "Brian",
    };

    polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.log("Error synthesizing speech:", err);
      } else {
        const audioContent = Buffer.from(data.AudioStream).toString("base64");
        const audioUrl = `data:audio/mp3;base64,${audioContent}`;
        setAudioUrl(audioUrl);
        setResponseData("");
      }
    });
  }, [responseData]);

  useEffect(() => {
    if (audioUrl) {
      setIsSpeaking(true);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    }
  }, [audioUrl, isSpeaking, startListening]);

  useEffect(() => {
    if (responseData) {
      const ssml = `
        <speak>
          <p>${responseData.replace(
            /"/g,
            (match) => `<say-as interpret-as="characters">${match}</say-as>`
          )}</p>
        </speak>
      `;

      const visemeParams = {
        OutputFormat: "json",
        SampleRate: "22050",
        Text: ssml,
        TextType: "ssml",
        VoiceId: "Brian",
        SpeechMarkTypes: ["viseme"],
      };

      polly.synthesizeSpeech(visemeParams, (err, data) => {
        if (err) {
          console.error("Error fetching viseme data:", err);
        } else {
          const jsonStr = Buffer.from(data.AudioStream).toString("utf8");
          const parsedJson = jsonStr
            .split("\n")
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (e) {
                return null;
              }
            })
            .filter((item) => item !== null);
          setCues(parsedJson);
          startTimeRef.current = performance.now() / 1000;
        }
      });
    }
  }, [responseData]);

  const { nodes, materials } = useGLTF("/models/667d2dc7ab338d43c837c83c.glb");

  useFrame(() => {
    const currentTime = performance.now() / 1000 - startTimeRef.current;

    for (let i = 0; i < cues.length; i++) {
      const mouthCue = cues[i];
      const startTime = mouthCue.time / 1000;
      const endTime = startTime + 0.3;

      if (currentTime >= startTime && currentTime <= endTime) {
        const viseme = corresponding[mouthCue.value.toUpperCase()] || "X";

        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[viseme]
          ] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
          ] = 1;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[viseme]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[viseme]
            ],
            1,
            morphTargetSmoothing
          );

          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
            ],
            1,
            morphTargetSmoothing
          );
        }

        break;
      } else {
        const viseme = corresponding[mouthCue.value.toUpperCase()] || "X";

        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[viseme]
          ] = 0;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
          ] = 0;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[viseme]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[viseme]
            ],
            0,
            morphTargetSmoothing
          );

          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]
            ],
            0,
            morphTargetSmoothing
          );
        }
      }
    }
  });

  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Headwear.geometry}
        material={materials.Wolf3D_Headwear}
        skeleton={nodes.Wolf3D_Headwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/667d2dc7ab338d43c837c83c.glb");
