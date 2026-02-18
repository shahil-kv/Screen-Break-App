import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Rule {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const RULES: Rule[] = [
    {
        id: 'schedule',
        title: 'Schedule Block',
        description: 'Block apps during specific time windows',
        icon: 'calendar-outline',
    },
    {
        id: 'launch',
        title: 'App Launch Limit',
        description: 'Block apps after reaching daily or hourly launch limit',
        icon: 'finger-print-outline',
    },
    {
        id: 'usage',
        title: 'Usage Budget',
        description: 'Block apps after reaching daily or hourly time limit',
        icon: 'time-outline',
    },
];

interface RuleCreationModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectRule: (ruleId: string) => void;
}

export const RuleCreationModal = ({ visible, onClose, onSelectRule }: RuleCreationModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View className="bg-gray-900 rounded-t-3xl p-6 h-[50%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">How do you want to Block?</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#999" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4">
                            {RULES.map((rule) => (
                                <TouchableOpacity 
                                    key={rule.id}
                                    onPress={() => {
                                        onSelectRule(rule.id);
                                        onClose();
                                    }}
                                    className="flex-row items-center bg-gray-800 p-4 rounded-xl mb-4"
                                >
                                    <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center mr-4">
                                        <Ionicons name={rule.icon} size={20} color="#FFF" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-base">{rule.title}</Text>
                                        <Text className="text-gray-400 text-sm mt-1">{rule.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};
