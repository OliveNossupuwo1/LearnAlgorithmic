from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class SimulationStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationStep
        fields = ['id', 'step_number', 'description', 'state_data', 'visual_data']


class SimulationSerializer(serializers.ModelSerializer):
    steps = SimulationStepSerializer(many=True, required=False)

    class Meta:
        model = Simulation
        fields = ['id', 'title', 'description', 'algorithm_code', 'order', 'steps']


class ConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concept
        fields = ['id', 'title', 'definition', 'syntax', 'order']


class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['id', 'title', 'description', 'code', 'explanation', 'order']


class QuizChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizChoice
        fields = ['id', 'choice_text', 'order']
        # is_correct n'est pas exposé ici pour éviter de révéler les réponses


class QuizQuestionSerializer(serializers.ModelSerializer):
    choices = QuizChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'question_type', 'points', 'order', 'choices']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'order', 'questions']


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'description', 'problem_statement', 
                  'points', 'order', 'hints']
        # expected_output et test_cases ne sont pas exposés


class LessonDetailSerializer(serializers.ModelSerializer):
    concepts = ConceptSerializer(many=True, read_only=True)
    examples = ExampleSerializer(many=True, read_only=True)
    simulations = SimulationSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)
    exercises = ExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'order', 'video_url', 
                  'video_embed_code', 'concepts', 'examples', 'simulations', 
                  'quizzes', 'exercises']


class LessonSerializer(serializers.ModelSerializer):
    concepts = ConceptSerializer(many=True, required=False)
    examples = ExampleSerializer(many=True, required=False)
    simulations = SimulationSerializer(many=True, required=False)

    class Meta:
        model = Lesson
        fields = ['id', 'module', 'title', 'description', 'order', 'video_url',
                  'video_embed_code', 'concepts', 'examples', 'simulations']

    def create(self, validated_data):
        concepts_data = validated_data.pop('concepts', [])
        examples_data = validated_data.pop('examples', [])
        simulations_data = validated_data.pop('simulations', [])

        lesson = Lesson.objects.create(**validated_data)

        # Créer les concepts
        for concept_data in concepts_data:
            # Retirer l'id et isNew si présents
            concept_data.pop('id', None)
            concept_data.pop('isNew', None)
            Concept.objects.create(lesson=lesson, **concept_data)

        # Créer les exemples
        for example_data in examples_data:
            # Retirer l'id et isNew si présents
            example_data.pop('id', None)
            example_data.pop('isNew', None)
            Example.objects.create(lesson=lesson, **example_data)

        # Créer les simulations
        for simulation_data in simulations_data:
            # Retirer l'id et isNew si présents
            simulation_data.pop('id', None)
            simulation_data.pop('isNew', None)

            # Extraire les steps
            steps_data = simulation_data.pop('steps', [])

            # Créer la simulation
            simulation = Simulation.objects.create(lesson=lesson, **simulation_data)

            # Créer les steps
            for step_data in steps_data:
                step_data.pop('id', None)
                SimulationStep.objects.create(simulation=simulation, **step_data)

        return lesson

    def update(self, instance, validated_data):
        concepts_data = validated_data.pop('concepts', None)
        examples_data = validated_data.pop('examples', None)
        simulations_data = validated_data.pop('simulations', None)

        # Mettre à jour les champs de base
        # Si module est un objet, extraire son ID
        module = validated_data.get('module', instance.module)
        if hasattr(module, 'id'):
            instance.module = module
        elif isinstance(module, int):
            instance.module_id = module
        else:
            instance.module = module

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.order = validated_data.get('order', instance.order)
        instance.video_url = validated_data.get('video_url', instance.video_url)
        instance.video_embed_code = validated_data.get('video_embed_code', instance.video_embed_code)
        instance.save()

        # Mettre à jour les concepts
        if concepts_data is not None:
            instance.concepts.all().delete()
            for concept_data in concepts_data:
                # Retirer l'id et isNew si présents
                concept_data.pop('id', None)
                concept_data.pop('isNew', None)
                Concept.objects.create(lesson=instance, **concept_data)

        # Mettre à jour les exemples
        if examples_data is not None:
            instance.examples.all().delete()
            for example_data in examples_data:
                # Retirer l'id et isNew si présents
                example_data.pop('id', None)
                example_data.pop('isNew', None)
                Example.objects.create(lesson=instance, **example_data)

        # Mettre à jour les simulations
        if simulations_data is not None:
            instance.simulations.all().delete()
            for simulation_data in simulations_data:
                # Retirer l'id et isNew si présents
                simulation_data.pop('id', None)
                simulation_data.pop('isNew', None)

                # Extraire les steps
                steps_data = simulation_data.pop('steps', [])

                # Créer la simulation
                simulation = Simulation.objects.create(lesson=instance, **simulation_data)

                # Créer les steps
                for step_data in steps_data:
                    step_data.pop('id', None)
                    SimulationStep.objects.create(simulation=simulation, **step_data)

        return instance


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lessons_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'lessons', 'lessons_count']
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson', 'lesson_title', 'is_completed', 
                  'quiz_score', 'exercise_score', 'combined_score', 'completion_date']


class UserProgressSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_order = serializers.IntegerField(source='module.order', read_only=True)
    
    class Meta:
        model = UserProgress
        fields = ['id', 'module', 'module_title', 'module_order', 
                  'is_unlocked', 'is_completed', 'completion_date']


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'quiz_title', 'score', 'total_points', 
                  'percentage', 'answers', 'completed_at']
        read_only_fields = ['score', 'total_points', 'percentage']


class ExerciseSubmissionSerializer(serializers.ModelSerializer):
    exercise_title = serializers.CharField(source='exercise.title', read_only=True)
    
    class Meta:
        model = ExerciseSubmission
        fields = ['id', 'exercise', 'exercise_title', 'code_submitted', 
                  'is_correct', 'score', 'feedback', 'submitted_at']
        read_only_fields = ['is_correct', 'score', 'feedback']


class DashboardStatsSerializer(serializers.Serializer):
    """Statistiques pour le tableau de bord utilisateur"""
    total_modules = serializers.IntegerField()
    completed_modules = serializers.IntegerField()
    unlocked_modules = serializers.IntegerField()
    overall_progress = serializers.FloatField()
    current_module = serializers.DictField()
    recent_activities = serializers.ListField()
